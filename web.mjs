import {
  formatMonthTitle,
  getFirstDayOfMonth,
  formatMonthValue,
  shiftMonth,
  changeMonthValue,
  getCalendarWeeks,
} from './common.mjs';

const monthYearEl = document.getElementById('month-year');
const pickerEl = document.getElementById('month-picker');
const daysEl = document.getElementById('days');
const eventDetailsEl = document.getElementById('show-event-details');

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

      // show days from another month in a different colour
      if (cell.isOutsideMonth) btn.classList.add('fade');
      // set a background colour to today's date
      if (cell.isToday) {
        btn.classList.add('today');
        btn.setAttribute('aria-current', 'date');
      }
      //check for events
      if (cell.events.length > 0) {
        const names = cell.events.map((e) => e.name).join(', ');
        btn.classList.add('has-event');
        btn.title = names;
        btn.setAttribute('aria-label', `${cell.label}, ${names}`);
        btn.addEventListener('click', () =>
          showEventDetails(cell.events, cell.day)
        );

        const toolTip = document.createElement('span');
        toolTip.className = 'tooltip';
        toolTip.textContent = names;
        toolTip.setAttribute('aria-hidden', 'true');

        td.append(btn, toolTip);
      }

      td.append(btn);
      row.append(td);
    }
    daysEl.append(row);
  }
}
render();
clearEventDetails();

function clearEventDetails() {
  eventDetailsEl.replaceChildren();
}

document.getElementById('prev').addEventListener('click', () => {
  currentDate = shiftMonth(currentDate, -1);
  clearEventDetails();
  render();
});

document.getElementById('next').addEventListener('click', () => {
  currentDate = shiftMonth(currentDate, 1);
  clearEventDetails();
  render();
});

pickerEl.addEventListener('change', () => {
  const date = changeMonthValue(pickerEl.value);
  if (!date) return;
  currentDate = date;
  clearEventDetails();
  render();
});

async function showEventDetails(events, day) {
  eventDetailsEl.replaceChildren();

  for (const event of events) {
    const title = document.createElement('h2');
    title.textContent = event.name;
    const date = document.createElement('h3');
    date.textContent = `${event.dayName} ${day} ${event.monthName}`;
    const details = document.createElement('p');
    details.textContent = 'Loading...';
    eventDetailsEl.append(title, date, details);
    try {
      const response = await fetch(event.descriptionURL);
      if (!response.ok) throw new Error(response.status);
      details.textContent = await response.text();
    } catch (error) {
      details.textContent = `Could not load the description: ${error}`;
    }
  }
}
