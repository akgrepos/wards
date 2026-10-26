// npm run sources:due: the cited guidelines, labels and reviews that are oldest and most used, for the April/October freshness sweep.
// The brief prints this too.
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sourcesDue, formatDue } from './lib/sources-due.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
for (const line of formatDue(sourcesDue(root))) console.log(line)
