// The app version is worked out from git, never typed: YYYY.MM.DD.N, where the date is the commit's date and N counts the
// commits on that date in the branch's history (oldest = 1). The same commit always gives the same version.
import { execFileSync } from 'node:child_process';

/** Pure part: `dates` is the newest-first list of commit dates (YYYY-MM-DD) from `ref` back to the start. */
export function versionFromDates(dates) {
  if (!dates.length) return null;
  const day = dates[0];
  const n = dates.filter((d) => d === day).length;
  return `${day.replace(/-/g, '.')}.${n}`;
}

/** Version of `ref` (default HEAD) in the repo at `cwd`. Falls back to today's date if git history is unavailable. */
export function computeVersion(ref = 'HEAD', cwd = process.cwd()) {
  try {
    const out = execFileSync('git', ['log', '--first-parent', '--format=%cs', ref], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const v = versionFromDates(out.split('\n').filter(Boolean));
    if (v) return v;
  } catch { /* shallow or missing history */ }
  return `${new Date().toISOString().slice(0, 10).replace(/-/g, '.')}.0`;
}
