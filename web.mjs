import { shiftMonth, getCalendarWeeks } from './common.mjs';

const daysElement = document.getElementById('days');
const headingElement = document.getElementById('month-year');
const monthPicker = document.getElementById('month-picker');

let date = new Date();

function renderCalendar() {
  // Show the month and year
  headingElement.textContent = date.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  // Keep the month picker synchronised
  restoreMonthPicker();

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

// handle the month picker changes 
monthPicker.addEventListener("change", handleMonthChange);

function handleMonthChange() {
  const selectedMonth = monthPicker.value;

  // Check if the selected value has the correct format
  if (!/^\d{4}-\d{2}$/.test(selectedMonth)) {
    restoreMonthPicker();
    return;
  }

  // Extract the year and month
  const [year, month] = selectedMonth.split("-").map(Number);

  // Check if the year and month are valid
  if (month < 1 || month > 12 || year < 1000 || year > 9999) {
    restoreMonthPicker();
    return;
  }

  // Update the selected date
  date = new Date(year, month - 1, 1);

  // Display the selected month
  renderCalendar();
}

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

// restore the month picker 
function restoreMonthPicker() {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  monthPicker.value = `${year}-${month}`;
}
