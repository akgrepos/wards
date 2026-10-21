"""Safeguard for the semicolon-to-bullets sweep: for every file changed against a base ref, the words and numbers
(ignoring case, punctuation, bullet markers, line breaks and repeated source markers) must be identical before and after.
Usage: python3 scripts/check-bullet-sweep.py origin/main"""
import re, subprocess, sys
base = sys.argv[1] if len(sys.argv) > 1 else 'origin/main'
files = subprocess.check_output(['git', 'diff', '--name-only', base, '--', 'content'], text=True).split()
SRC = re.compile(r'\^\[[^\]]*\]')
def words(t):
    srcs = set(SRC.findall(t))
    t = SRC.sub(' ', t)
    return re.findall(r'[\w·⁰-₟α-ω≥≤<>%]+', t.lower()), srcs
bad = 0
for f in files:
    old = subprocess.check_output(['git', 'show', f'{base}:{f}'], text=True)
    new = open(f).read()
    (a, sa), (b, sb) = words(old), words(new)
    ok = a == b and sa == sb
    print(('OK   ' if ok else 'FAIL ') + f)
    bad += not ok
print(f'{len(files)} files checked, {bad} differences')
sys.exit(1 if bad else 0)
