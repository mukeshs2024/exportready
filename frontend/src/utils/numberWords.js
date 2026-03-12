/**
 * Convert a number to words (for commercial invoice totals).
 * Supports values up to 999,999,999.
 */

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function convertChunk(n) {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  return (
    ONES[Math.floor(n / 100)] +
    " Hundred" +
    (n % 100 ? " and " + convertChunk(n % 100) : "")
  );
}

export function numberToWords(num) {
  if (num == null || isNaN(num)) return "";
  const n = Math.abs(Math.floor(num));
  if (n === 0) return "Zero";

  const millions = Math.floor(n / 1000000);
  const thousands = Math.floor((n % 1000000) / 1000);
  const remainder = n % 1000;

  let words = "";
  if (millions) words += convertChunk(millions) + " Million ";
  if (thousands) words += convertChunk(thousands) + " Thousand ";
  if (remainder) words += convertChunk(remainder);

  return words.trim();
}
