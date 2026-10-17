import { describe, test, expect } from '@jest/globals';
import { shiftMonth, getCalendarWeeks } from './common.mjs';

const d = (year, month, day) => new Date(year, month - 1, day);

describe('shiftMonth', () => {
  test('moves to the 1st of next month', () => {
    expect(shiftMonth(d(2026, 10, 1), 1)).toEqual(d(2026, 11, 1));
  });

  test('moves to the 1st of previous month', () => {
    expect(shiftMonth(d(2026, 10, 1), -1)).toEqual(d(2026, 9, 1));
  });
});

describe('getCalendarWeeks', () => {
  test('getCalendarWeeks returns full weeks and flags today/outside days', () => {
    const weeks = getCalendarWeeks(new Date(2024, 1, 1), new Date(2024, 1, 14));
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    const cells = weeks.flat();
    expect(cells.filter((c) => c.isToday)).toHaveLength(1);
    expect(cells.filter((c) => !c.isOutsideMonth)).toHaveLength(29);
  });
});
