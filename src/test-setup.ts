// Tests read the whole content at once instead of fetching one card at a time.
import full from 'virtual:wards-content-full';
import { seedFullContent } from './content';

seedFullContent(full);
