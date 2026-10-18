const DAYS_IN_WEEK = 7;
const LOCALE = 'en-GB'; // set date format to British standard

export function getFirstDayOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function formatMonthTitle(date) {
  return date.toLocaleDateString(LOCALE, {
    month: 'long',
    year: 'numeric',
  });
}

function formatDayLabel(date) {
  return date.toLocaleDateString(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatMonthValue(date) {
  // format value in month title - eg October 2026
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function changeMonthValue(value) {
  // format date value inside date picker
  if (!value) return null;
  const [year, month] = value.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

// shift previous or next month
export function shiftMonth(date, offset) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

export function getCalendarWeeks(currentDate, today = new Date()) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  //week index is 0 to 6 - 0 being Sunday
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // days that roll into the following month
  const trailingDays =
    (DAYS_IN_WEEK - ((firstDayIndex + daysInMonth) % DAYS_IN_WEEK)) %
    DAYS_IN_WEEK;

  const totalCells = firstDayIndex + daysInMonth + trailingDays;
  const todayString = today.toDateString();

  const weeks = [];
  for (let i = 0; i < totalCells; i++) {
    if (i % DAYS_IN_WEEK === 0) weeks.push([]);
    const date = new Date(year, month, 1 - firstDayIndex + i);
    weeks[weeks.length - 1].push({
      date,
      day: date.getDate(),
      label: formatDayLabel(date),
      isOutsideMonth: date.getMonth() !== month,
      isToday: date.toDateString() === todayString,
    });
  }
  return weeks;
}
