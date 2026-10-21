import { describe, test, expect } from "@jest/globals";
import { shiftMonth, getCalendarWeeks } from "./common.mjs";

describe("shiftMonth", () => {
  test("moves from December to January of the next year", () => {
    const date = new Date(2024, 11, 1);

    const result = shiftMonth(date, 1);

    expect(result).toEqual(new Date(2025, 0, 1));
  });
});

describe("getCalendarWeeks", () => {
  test("October 2024 has five weeks and starts on Tuesday", () => {
    const weeks = getCalendarWeeks(new Date(2024, 9, 1));

    expect(weeks).toHaveLength(5);
    expect(weeks.every((week) => week.length === 7)).toBe(true);

    // The first two cells belong to September
    expect(weeks[0][0].isOutsideMonth).toBe(true);
    expect(weeks[0][1].isOutsideMonth).toBe(true);

    // October 1 is Tuesday, the third column
    expect(weeks[0][2].day).toBe(1);
  });

  test("February 2026 has four complete weeks", () => {
    const weeks = getCalendarWeeks(new Date(2026, 1, 1));

    expect(weeks).toHaveLength(4);
    expect(weeks.flat()).toHaveLength(28);
  });

  test("Ada Lovelace Day is on October 8, 2024", () => {
    const weeks = getCalendarWeeks(new Date(2024, 9, 1));

    const october8 = weeks
      .flat()
      .find((day) => !day.isOutsideMonth && day.day === 8);

    expect(
      october8.events.some((event) => event.name === "Ada Lovelace Day"),
    ).toBe(true);
  });
});
