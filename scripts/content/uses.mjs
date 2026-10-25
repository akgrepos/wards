// npm run content:uses -- dose:ceftriaxone-1g
// Prints every card that uses a data item (a dose, source, threshold, regimen, criteria, calc, pathway …), directly or
// through another item (a regimen's doses, a dose's sources). Same rule the app uses to decide what a card's file holds.
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadContent } from './load.mjs';
import { splitContent } from './split.mjs';

export function cardsUsing(split, kind, id) {
  return Object.entries(split.cards).filter(([, p]) => p.data[kind]?.[id]).map(([cardId]) => cardId).sort();
}

const arg = process.argv[2];
{
  const m = (arg ?? '').match(/^([a-z-]+):([a-z0-9-]+)$/);
  if (!m) {
    console.error('Usage: npm run content:uses -- <kind>:<id>   for example  dose:ceftriaxone-1g  or  source:common-practice');
    process.exit(1);
  }
  const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
  const content = loadContent(root, { includeExamples: true });
  const [, kind, id] = m;
  if (!content.data[kind]?.[id]) {
    console.error(`No ${kind} called "${id}". ${kind in content.data ? `Kinds that exist: ${Object.keys(content.data).join(', ')}.` : `Known kinds: ${Object.keys(content.data).join(', ')}.`}`);
    process.exit(1);
  }
  const cards = cardsUsing(splitContent(content), kind, id);
  if (kind === 'drug') {
    const doses = Object.entries(content.data.dose ?? {}).filter(([, d]) => d.drug === id).map(([k]) => k).sort();
    console.log(`drug:${id} has ${doses.length} dose${doses.length === 1 ? '' : 's'}${doses.length ? `: ${doses.join(', ')}` : ''}.`);
  }
  console.log(cards.length ? `${kind}:${id} is used by ${cards.length} card${cards.length === 1 ? '' : 's'}:\n${cards.map((c) => `  - ${c}`).join('\n')}` : `${kind}:${id} is not used by any card.`);
}
