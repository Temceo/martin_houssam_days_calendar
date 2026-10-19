
const headingElement = document.getElementById("month-year");

function renderCalendar(date = new Date()) {
  headingElement.textContent = date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

renderCalendar();
