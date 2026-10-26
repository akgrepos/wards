// Severity-ladder lint (docs/CARD-WRITING-CHEATSHEET.md, "Severity"). A ladder written as bullets ("- Mild: …", "- Severe: …") loses its
// color codes; it should be a :::scale block. rules.mjs turns these lines into findings.
const LEVEL = /^\s*[-*]\s+(mild|moderate|severe)\s*:/i;
const OPEN = /^:::scale\b/;
const CLOSE = /^:::\s*$/;

// Line numbers (1-based) where a run of two or more consecutive level bullets starts, outside any :::scale block.
export function severityLadderLines(src) {
  const found = [];
  let inScale = false;
  let runStart = null;
  let runLength = 0;
  const lines = src.split('\n');
  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (OPEN.test(line)) inScale = true;
    else if (inScale && CLOSE.test(line)) inScale = false;
    if (!inScale && LEVEL.test(line)) {
      if (runLength === 0) runStart = i + 1;
      runLength++;
      if (runLength === 2) found.push(runStart);
      return;
    }
    runLength = 0;
  });
  return found;
}
