"""Builds content/data/media/*.yaml from open ECG recordings (DECISIONS 2026-10-17 "Images"; 2026-10-21 "ECG figures").

Run by hand, never in CI. It needs the source recordings downloaded beside it (not committed):
  PTB-XL 1.0.3 (PhysioNet, CC BY 4.0): records500/<folder>/<id>_hr.hea and .dat
  Large-scale 12-lead ECG database for arrhythmia study 1.0.0 (PhysioNet, CC BY 4.0): WFDBRecords/.../<id>.hea and .mat
Usage: python3 -I scripts/media/extract_ecg.py <folder with the downloaded records>
It keeps only the leads shown, 10 seconds, at 250 samples/s in units of 0.01 mV, plus the record ID: no other data.
Every mark (R-R intervals, ST at the J point, T and U heights) is measured here on the raw 500/s signal against the PR
baseline, so the numbers on screen come from the recording, not from the smoothed line the card draws.
"""
import math, struct, sys, os, re

def read_wfdb(base):  # PTB-XL: format 16, interleaved int16, gain in the header
    h = open(base + '.hea').read().strip().splitlines(); n, fs, ns = h[0].split()[1:4]; n, fs, ns = int(n), float(fs), int(ns)
    leads, gains = [], []
    for l in h[1:1 + n]:
        p = l.split(); gains.append(float(re.match(r'[\d.]+', p[2]).group(0))); leads.append(p[-1].upper())
    raw = open(base + '.dat', 'rb').read(); v = struct.unpack('<%dh' % (len(raw) // 2), raw)
    return fs, {leads[i]: [v[j * n + i] / gains[i] for j in range(ns)] for i in range(n)}

def read_mat(base):  # Chapman-Shaoxing-Ningbo: MATLAB v4, 24-byte header, int16, 1000 per mV
    h = open(base + '.hea').read().strip().splitlines(); n, fs, ns = h[0].split()[1:4]; n, fs, ns = int(n), float(fs), int(ns)
    leads = [l.split()[-1].upper() for l in h[1:1 + n]]
    v = struct.unpack('<%dh' % (n * ns), open(base + '.mat', 'rb').read()[24:24 + n * ns * 2])
    return fs, {leads[i]: [v[j * n + i] / 1000 for j in range(ns)] for i in range(n)}

med = lambda a: sorted(a)[len(a) // 2]

def rpeaks(x, fs):
    d = [abs(x[i + 1] - x[i - 1]) for i in range(1, len(x) - 1)]; thr = 0.4 * max(d); out = []; i = 0
    while i < len(d):
        if d[i] > thr:
            w = range(max(0, i - int(.06 * fs)), min(len(x), i + int(.08 * fs)))
            out.append(max(w, key=lambda k: abs(x[k] - med(x[max(0, k - 200):k + 200])))); i += int(.25 * fs)
        else: i += 1
    return out

def store(x, fs):  # first 9.8 s, 500/s -> 250/s by averaging pairs; units of 0.01 mV
    y = [(x[i] + x[i + 1]) / 2 for i in range(0, min(len(x), int(9.8 * fs)) - 1, 2)]
    return ' '.join(str(round(v * 100)) for v in y)

r2 = lambda v: round(v, 3)
def yq(s): return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'

def af(dl, root):
    fs, s = read_wfdb(dl + '/08215_hr'); x = s['II']; t0, t1 = 0.4, 3.4
    r = [i for i in rpeaks(x, fs) if t0 * fs <= i <= t1 * fs]
    marks = []
    for a, b in zip(r, r[1:]):
        marks.append({'kind': 'interval', 'from': r2(a / fs), 'to': r2(b / fs), 'label': f'R-R {round((b - a) / fs * 1000)} ms'})
    for a, b in zip(r, r[1:]):
        marks.append({'kind': 'band', 'from': r2(a / fs + .40), 'to': r2(b / fs - .04), 'low': -0.25, 'high': 0.2})
    marks.append({'kind': 'text', 'at': r2((r[0] / fs + .40 + r[1] / fs - .04) / 2), 'mv': -0.25, 'label': 'no P waves', 'place': 'below'})
    rate = round(60000 / (sum(b - a for a, b in zip(r, r[1:])) / (len(r) - 1) / fs * 1000))
    return dict(leads={L: store(s[L], fs) for L in ['II', 'V1']}, marks=marks, show=(t0, t1), rr=[round((b - a) / fs * 1000) for a, b in zip(r, r[1:])], rate=rate)

def nste(dl, root):
    fs, s = read_wfdb(dl + '/02109_hr'); x = s['V5']; t0, t1 = 0.3, 2.4
    R = [i for i in rpeaks(x, fs) if t0 * fs <= i <= t1 * fs][0]
    bl = med(x[R - int(.11 * fs):R - int(.07 * fs)])
    J = R + int(.048 * fs)  # end of the QRS here is R+40-48 ms; the later point is the conservative one (reviewer, 2026-10-21)
    tm = min(range(R + int(.15 * fs), R + int(.40 * fs)), key=lambda i: x[i])
    st, td = round((x[J] - bl) * 10, 1), round((x[tm] - bl) * 10, 1)
    marks = [
        {'kind': 'baseline', 'from': r2(R / fs - .32), 'to': r2(tm / fs + .2), 'mv': r2(bl)},
        {'kind': 'band', 'from': r2(J / fs), 'to': r2(tm / fs + .09), 'low': r2(x[tm] - .08), 'high': r2(bl + .06)},
        {'kind': 'text', 'at': r2(J / fs + .02), 'mv': r2(x[tm]), 'label': f'ST {st:+.1f} mm at J'.replace('-', '−'), 'place': 'below', 'align': 'start'},
        {'kind': 'text', 'at': r2(J / fs + .02), 'mv': r2(x[tm]), 'label': f'T {td:+.1f} mm'.replace('-', '−'), 'place': 'below2', 'align': 'start'},
    ]
    return dict(leads={L: store(s[L], fs) for L in ['V4', 'V5', 'V6']}, marks=marks, show=(t0, t1), st=st, t=td, j_ms=round((J - R) / fs * 1000))

def hypok(dl, root):
    fs, s = read_mat(dl + '/JS01656'); x = s['V5']; t0, t1 = 3.0, 5.6
    R = [i for i in rpeaks(s['V3'], fs) if t0 * fs <= i <= t1 * fs][0]
    sm = lambda i: sum(x[i - 7:i + 8]) / 15
    bl = med(x[R - int(.072 * fs):R - int(.036 * fs)])  # PR segment (PR is short in this record)
    T = max(range(R + int(.18 * fs), R + int(.38 * fs)), key=sm); U = max(range(R + int(.45 * fs), R + int(.65 * fs)), key=sm)
    th, uh = round((sm(T) - bl) * 10, 1), round((sm(U) - bl) * 10, 1)
    top = max(sm(T), sm(U))
    marks = [
        {'kind': 'baseline', 'from': r2(T / fs - .24), 'to': r2(U / fs + .24), 'mv': r2(bl)},
        {'kind': 'band', 'from': r2(U / fs - .09), 'to': r2(U / fs + .09), 'low': r2(bl - .02), 'high': r2(sm(U) + .03)},
        {'kind': 'text', 'at': r2(T / fs - .05), 'mv': r2(top), 'label': f'T {th:.1f}', 'place': 'above'},
        {'kind': 'text', 'at': r2(U / fs + .05), 'mv': r2(top), 'label': f'U {uh:.1f}', 'place': 'above'},
    ]
    return dict(leads={L: store(s[L], fs) for L in ['V4', 'V5', 'V6']}, marks=marks, show=(t0, t1), T=th, U=uh, u_ms=round((U - R) / fs * 1000))

def emit(path, res):
    """The measured part of a media file: its marks and its recording's leads. The rest (title, caption, sources) is
    written by hand in content/data/media/<id>.yaml; paste these two blocks over the ones there."""
    lines = ['marks:']
    for m in res['marks']:
        lines.append('  - { ' + ', '.join(f'{k}: {yq(v) if isinstance(v, str) else v}' for k, v in m.items()) + ' }')
    lines.append('recording leads (250 samples/s, 0.01 mV):')
    for k, v in res['leads'].items(): lines.append(f'    {k}: "{v}"')
    open(path, 'w').write('\n'.join(lines) + '\n')

if __name__ == '__main__':
    dl = sys.argv[1]
    for name, fn in [('ecg-af', af), ('ecg-nste-acs', nste), ('ecg-hypokalemia', hypok)]:
        res = fn(dl, None)
        print(name, {k: v for k, v in res.items() if k not in ('leads', 'marks')})
        emit(os.path.join(dl, name + '.measured.txt'), res)
