import {
  formatMonthTitle,
  getFirstDayOfMonth,
  formatMonthValue,
  shiftMonth,
  changeMonthValue,
  getCalendarWeeks,
} from './common.mjs';
import daysData from './days.json' with { type: 'json' };

const monthYearEl = document.getElementById('month-year');
const pickerEl = document.getElementById('month-picker');
const daysEl = document.getElementById('days');

let currentDate = getFirstDayOfMonth();

function render() {
  monthYearEl.textContent = formatMonthTitle(currentDate);
  pickerEl.value = formatMonthValue(currentDate);
  daysEl.replaceChildren();

  for (const week of getCalendarWeeks(currentDate)) {
    const row = document.createElement('tr');

    for (const cell of week) {
      const td = document.createElement('td');
      const btn = document.createElement('button');

      btn.type = 'button';
      btn.textContent = cell.day;
      btn.setAttribute('aria-label', cell.label);

      if (cell.isOutsideMonth) btn.classList.add('fade');
      if (cell.isToday) {
        btn.classList.add('today');
        btn.setAttribute('aria-current', 'date');
      }

      td.append(btn);
      row.append(td);
    }
    daysEl.append(row);
  }
}
render();

document.getElementById('prev').addEventListener('click', () => {
  currentDate = shiftMonth(currentDate, -1);
  render();
});

document.getElementById('next').addEventListener('click', () => {
  currentDate = shiftMonth(currentDate, 1);
  render();
});

pickerEl.addEventListener('change', () => {
  const date = changeMonthValue(pickerEl.value);
  if (!date) return;
  currentDate = date;
  render();
});
