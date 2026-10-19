import days from './days.json' with { type: 'json' };

const DAYS_IN_WEEK = 7;
const LOCALE = 'en-GB'; // set date format to British standard

function formatDayLabel(date) {
  return date.toLocaleDateString(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getCalendarWeeks(today = new Date()) {
  const year = today.getFullYear();
  const month = today.getMonth();
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
