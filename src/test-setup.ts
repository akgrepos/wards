// Tests read the whole content at once instead of fetching one card at a time.
import full from 'virtual:wards-content-full';
import { splitContent } from '../scripts/content/split.mjs';
import { seedFullContent } from './content';

seedFullContent(full, (splitContent(full as never).index as { search: NonNullable<typeof full.search> }).search);
