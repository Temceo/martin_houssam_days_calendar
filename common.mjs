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

export function shiftMonth(date, offset) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

export function getCalendarWeeks(today = new Date(), events = days) {
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
      events: events.filter((e) => getEvents(e, date)),
    });
  }
  return weeks;
}

// events
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const OCCURRENCES = { first: 1, second: 2, third: 3, last: 4 };

function getEvents(event, date) {
  // exit if either month or day of week don't match event details
  if (MONTHS[date.getMonth()] !== event.monthName) return false;
  if (DAYS[date.getDay()] !== event.dayName) return false;

  const dayOfMonth = date.getDate();

  // check if this event falls in the last week of the month
  if (event.occurrence === 'last') {
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    return dayOfMonth + 7 > daysInMonth;
  }
  // check the nth occurrence of the month's week day - eg 2nd Tuesday
  return Math.ceil(dayOfMonth / 7) === OCCURRENCES[event.occurrence];
}
