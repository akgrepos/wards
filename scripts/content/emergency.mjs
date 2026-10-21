// Shared by the build and the app (no Node imports here).
// A topic's "## Do Now" section (its emergency) is numbered steps. Inside a step, each line is one of:
//   - If: <when the step applies> ^[source]      the step's condition line (at most one, first)
//   - Check: <what to check before giving> ^[source]
//   - Warning: <one or two words> ^[source]      a warning tag on the dose row above it (or on the step)
//   {{dose:id}}                                    a dose to give, one drug per row, in order
//   - <anything else> ^[source]                    a short note
// Notes about the whole emergency can follow the steps in :::note boxes.

const PREFIX = /^(If|Check|Warning):\s*/;

// Splits "Check: text" into its kind and the text after the label (the label is only in the first text run).
function labelOf(inlines) {
  const first = inlines[0];
  const m = first && first.t === 'text' ? first.v.match(PREFIX) : null;
  if (!m) return { kind: 'note', inlines };
  const rest = first.v.slice(m[0].length);
  return { kind: m[1].toLowerCase(), inlines: rest ? [{ ...first, v: rest }, ...inlines.slice(1)] : inlines.slice(1) };
}

const textOf = (inlines) => inlines.map((x) => x.v ?? '').join('').trim();

/**
 * The Do Now steps of an emergency, or [] when the blocks have none:
 * { title, condition: {inlines, sources} | null, parts: [{ kind: 'check'|'note', inlines, sources } | { kind: 'dose', id, warnings: [{text, sources}] }], warnings }
 * `problems` collects what doesn't follow the format (the content check reports them).
 */
export function emergencySteps(blocks, problems = []) {
  const stepsBlock = blocks.find((b) => b.t === 'steps');
  if (!stepsBlock) return [];
  return stepsBlock.items.map((it, n) => {
    const step = { title: it.inlines, alt: !!it.alt, condition: null, parts: [], warnings: [] };
    const where = `step ${n + 1}`;
    if (!textOf(it.inlines)) problems.push(`${where} needs a short name ("1. Shift K⁺")`);
    for (const b of it.blocks) {
      if (b.t === 'insert' && b.kind === 'dose') { step.parts.push({ kind: 'dose', id: b.id, warnings: [] }); continue; }
      if (b.t !== 'list') { problems.push(`${where}: only "- " lines and {{dose:…}} lines go inside a Do Now step (found ${b.t === 'insert' ? `{{${b.kind}:…}}` : b.t})`); continue; }
      for (const item of b.items) {
        const { kind, inlines } = labelOf(item.inlines);
        if (item.children.length) problems.push(`${where}: Do Now lines can't have sub-bullets`);
        if (kind === 'if') {
          if (step.condition) problems.push(`${where} has more than one "If:" line`);
          else if (step.parts.length) problems.push(`${where}: the "If:" line comes first`);
          step.condition = { inlines, sources: item.sources };
        } else if (kind === 'warning') {
          const w = { text: textOf(inlines), sources: item.sources };
          if (w.text.split(/\s+/).length > 3) problems.push(`${where}: a warning is a tag of one to three words ("${w.text}")`);
          const lastDose = [...step.parts].reverse().find((p) => p.kind === 'dose');
          (lastDose ? lastDose.warnings : step.warnings).push(w);
        } else {
          step.parts.push({ kind, inlines, sources: item.sources });
        }
      }
    }
    if (!step.parts.length) problems.push(`${where} has nothing to do: add a dose or a line`);
    return step;
  });
}

/** The doses of a step, in order. */
export const stepDoses = (step) => step.parts.filter((p) => p.kind === 'dose').map((p) => p.id);

// "1 h" → 60, "30" with unit "min" → 30, "24 h" → 1440 (minutes); null when it can't be read.
export function offsetMinutes(text, unit) {
  const m = String(text).trim().match(/^(\d+(?:\.\d+)?)\s*(min|minutes?|h|hours?)?$/i);
  if (!m) return null;
  const u = (m[2] ?? unit ?? '').toLowerCase();
  if (u.startsWith('h')) return Number(m[1]) * 60;
  if (u.startsWith('min')) return Number(m[1]);
  return null;
}

/**
 * Rechecks that Timed Mode schedules from the topic's :::times blocks marked {after=… check=…}:
 * [{ check, after: 'first' | <dose id>, minutes: number[], sources }].
 */
export function recheckSchedules(card) {
  const out = [];
  const walk = (blocks) => {
    for (const b of blocks) {
      if (b.t === 'times' && b.attrs?.after) {
        out.push({ check: b.attrs.check ?? '', after: b.attrs.after, minutes: b.items.map((it) => offsetMinutes(it.text, b.attrs.unit)).filter((x) => x != null), sources: b.sources });
      }
      if (b.t === 'steps') b.items.forEach((it) => walk(it.blocks));
    }
  };
  for (const s of card.sections ?? []) { walk(s.blocks); (s.subsections ?? []).forEach((x) => walk(x.blocks)); }
  return out;
}
