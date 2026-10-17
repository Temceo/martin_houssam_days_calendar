import { getGreeting } from './common.mjs';
import daysData from './days.json' with { type: 'json' };

const monthYearEl = document.getElementById('month-year');
const pickerEl = document.getElementById('month-picker');
const daysEl = document.getElementById('days');
const DAYS_IN_WEEK = 7;
const LOCALE = 'en-GB';

let currentDate = new Date();
currentDate.setDate(1);

function render() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const trailingDays =
    (DAYS_IN_WEEK - ((firstDayOfMonth + daysInMonth) % DAYS_IN_WEEK)) %
    DAYS_IN_WEEK;

  const totalCalendarCells = firstDayOfMonth + daysInMonth + trailingDays;

  monthYearEl.textContent = currentDate.toLocaleDateString(LOCALE, {
    month: 'long',
    year: 'numeric',
  });

  pickerEl.value = `${year}-${String(month + 1).padStart(2, '0')}`;

  const today = new Date().toDateString();
  daysEl.replaceChildren();

  let row;
  for (let i = 0; i < totalCalendarCells; i++) {
    if (i % DAYS_IN_WEEK === 0) {
      row = document.createElement('tr');
      daysEl.append(row);
    }

    const date = new Date(year, month, 1 - firstDayOfMonth + i);
    const td = document.createElement('td');
    const btn = document.createElement('button');

    btn.type = 'button';
    btn.textContent = date.getDate();
    console.log(date.getDate());
    btn.setAttribute(
      'aria-label',
      date.toLocaleDateString(LOCALE, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );

    if (date.getMonth() !== month) td.classList.add('fade');
    if (date.toDateString() === today) {
      td.classList.add('today');
      btn.setAttribute('aria-current', 'date');
    }

    td.append(btn);
    row.append(td);
  }
}
render();
