import { PageBreak } from '@/types/newspaper';

export interface SplitGroup {
  items: string[];
  startIndex: number;
  continueNumbering: boolean;
}

/**
 * Splits an array of items at manual page break positions.
 * If no breaks, returns all items as a single group.
 */
export const splitAtBreaks = (items: string[], breaks: PageBreak[] = []): SplitGroup[] => {
  if (items.length === 0) return [{ items: [], startIndex: 0, continueNumbering: false }];
  if (!breaks || breaks.length === 0) return [{ items, startIndex: 0, continueNumbering: false }];

  const sorted = [...breaks]
    .filter(b => b.afterIndex >= 0 && b.afterIndex < items.length)
    .sort((a, b) => a.afterIndex - b.afterIndex);

  if (sorted.length === 0) return [{ items, startIndex: 0, continueNumbering: false }];

  const groups: SplitGroup[] = [];
  let currentStart = 0;
  let runningIndex = 0;

  for (const brk of sorted) {
    const end = brk.afterIndex + 1;
    if (end > currentStart) {
      groups.push({
        items: items.slice(currentStart, end),
        startIndex: runningIndex,
        continueNumbering: groups.length === 0 ? false : brk.continueNumbering,
      });
      if (brk.continueNumbering) {
        runningIndex += (end - currentStart);
      } else {
        runningIndex = 0;
      }
      currentStart = end;
    }
  }

  // Remaining items after last break
  if (currentStart < items.length) {
    const lastBreak = sorted[sorted.length - 1];
    groups.push({
      items: items.slice(currentStart),
      startIndex: lastBreak.continueNumbering ? runningIndex : 0,
      continueNumbering: lastBreak.continueNumbering,
    });
  }

  return groups;
};
