import Papa from 'papaparse';

// The 8 columns of a task file, in the standard order. A file without a header
// line must use this order.
export const CSV_COLUMNS = [
  'id',
  'title',
  'description',
  'category',
  'priority',
  'start_date',
  'due_date',
  'status',
];

/**
 * @typedef {Object} CsvRow
 * @property {number} rowNumber  the line number in the file, counted like Excel (first line = 1)
 * @property {Record<string, string>} values  the 8 values by column name, spaces trimmed
 */

/**
 * Turns the text of a CSV file into rows. Knows nothing about task rules.
 * - The first line is a header if it contains any column name; columns are then matched by name.
 * - Otherwise there is no header, and every line is a task with the columns in standard order.
 * @param {string} text  the whole file
 * @returns {{ hasHeader: boolean, rows: CsvRow[], error: string | null }}
 */
export function parseCsv(text) {
  // Remove the invisible BOM mark some programs (e.g. Excel) put at the very start.
  const cleanText = (text ?? '').replace(/^\uFEFF/, '');

  const lines = Papa.parse(cleanText, { header: false }).data;

  // Keep each line's own number before dropping empty lines, so row numbers match the file.
  const nonEmptyLines = lines
    .map((cells, index) => ({ cells: cells.map((cell) => cell.trim()), lineNumber: index + 1 }))
    .filter((line) => line.cells.some((cell) => cell !== ''));

  if (nonEmptyLines.length === 0) {
    return { hasHeader: false, rows: [], error: 'The file is empty' };
  }

  const firstLine = nonEmptyLines[0].cells.map((cell) => cell.toLowerCase());
  const hasHeader = CSV_COLUMNS.some((column) => firstLine.includes(column));

  if (hasHeader) {
    const missing = CSV_COLUMNS.filter((column) => !firstLine.includes(column));
    if (missing.length > 0) {
      return { hasHeader: true, rows: [], error: `Missing column: ${missing.join(', ')}` };
    }

    // Where each column is in this file, e.g. { id: 0, title: 1, ... }.
    const positions = Object.fromEntries(
      CSV_COLUMNS.map((column) => [column, firstLine.indexOf(column)]),
    );
    const rows = nonEmptyLines.slice(1).map((line) => toRow(line, positions));
    return { hasHeader: true, rows, error: null };
  }

  // No header: the standard order, so column number i is CSV_COLUMNS[i].
  const positions = Object.fromEntries(CSV_COLUMNS.map((column, index) => [column, index]));
  const rows = nonEmptyLines.map((line) => toRow(line, positions));
  return { hasHeader: false, rows, error: null };
}

// One line of cells → { rowNumber, values: { id, title, ... } }. A missing cell becomes ''.
function toRow(line, positions) {
  const values = Object.fromEntries(
    CSV_COLUMNS.map((column) => [column, line.cells[positions[column]] ?? '']),
  );
  return { rowNumber: line.lineNumber, values };
}
