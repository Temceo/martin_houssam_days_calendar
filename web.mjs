import { shiftMonth, getCalendarWeeks } from './common.mjs';

const daysElement = document.getElementById('days');
const headingElement = document.getElementById('month-year');

let date = new Date();

function renderCalendar() {
  // Show the month and year
  headingElement.textContent = date.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  // Remove previously displayed calendar rows
  daysElement.replaceChildren();

  // Get the weeks calculated in common.mjs
  const weeks = getCalendarWeeks(date);

  // Create one table row for each week
  for (const week of weeks) {
    const row = document.createElement('tr');
    // Create seven cells for each week
    for (const day of week) {
      const cell = document.createElement('td');
      // Only show days belonging to the selected month
      if (!day.isOutsideMonth) {
        cell.textContent = day.day;
      }

      row.append(cell);
    }

    daysElement.append(row);
  }
}
// Display the current month when the page loads
renderCalendar();

// display previous month on click of previous button
document.getElementById('prev').addEventListener('click', () => {
  date = shiftMonth(date, -1);
  renderCalendar();
});

// display next month on click of next button
document.getElementById('next').addEventListener('click', () => {
  date = shiftMonth(date, 1);
  renderCalendar();
});
