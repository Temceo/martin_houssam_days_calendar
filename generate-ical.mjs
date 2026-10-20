import { writeFile } from 'node:fs/promises';
import { getEvents } from './common.mjs';
import days from './days.json' with { type: 'json' };

const START_YEAR = 2020;
const END_YEAR = 2030;

// Date created stamp to be included in every event
const stamp = new Date().toISOString().replaceAll(/[-:]|\.\d{3}/g, '');

// format date into the iCal date format: 20261020
function formatDate(date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
}

// escape characters in manner required by iCal
function escapeIcalText(text) {
  return text
    .replaceAll('\\', '\\\\')
    .replaceAll('\r\n', '\\n')
    .replaceAll('\r', '\\n')
    .replaceAll('\n', '\\n')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,');
}

// fold line if longer than 75 bytes for iCalendar
function foldLine(line) {
  const parts = [];
  let currentLine = '';
  let bytes = 0;

  for (const character of line) {
    const size = Buffer.byteLength(character, 'utf8');
    if (bytes + size > 75) {
      parts.push(currentLine);
      currentLine = ` ${character}`;
      bytes = 1 + size;
    } else {
      currentLine += character;
      bytes += size;
    }
  }

  parts.push(currentLine);
  return parts.join('\r\n');
}

function getEventDate(event, year) {
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
      const date = new Date(year, month, dayOfMonth);
      if (getEvents(event, date)) return date;
    }
  }
  throw new Error(`Could not find a date for ${event.name}in ${year}`);
}

function createEvent(day, year) {
  const startDate = getEventDate(day, year);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
  const identifier = `${day.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}-${year}`;

  const lines = [
    'BEGIN:VEVENT',
    `UID:${identifier}@days-calendar`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${formatDate(startDate)}`,
    `DTEND;VALUE=DATE:${formatDate(endDate)}`,
    `SUMMARY:${escapeIcalText(day.name)}`,
    'END:VEVENT',
  ];

  return lines.map(foldLine);
}

const events = [];

for (let year = START_YEAR; year <= END_YEAR; year++) {
  for (const day of days) {
    events.push(...createEvent(day, year));
  }
}

const calendar = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Days Calendar//EN',
  'CALSCALE:GREGORIAN',
  ...events,
  'END:VCALENDAR',
].join('\r\n');

const eventCount = days.length * (END_YEAR - START_YEAR + 1);

await writeFile('days.ics', `${calendar}\r\n`);
console.log(`Created days.ics with ${eventCount} all-day events`);
