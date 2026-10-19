import { getCalendarWeeks } from "./common.mjs";

const headingElement = document.getElementById("month-year");

function renderCalendar(date = new Date()) {
  // Show the month and year
  headingElement.textContent = date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  // Get the weeks calculated in common.mjs
  const weeks = getCalendarWeeks(date);

  // Create one table row for each week
  for (const week of weeks) {
    const row = document.createElement("tr");

    daysElement.append(row);
  }
}

renderCalendar();
