/**
 * Formats a number as Indian Rupee currency.
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a score as a percentage string.
 * @param {number} score - Value between 0 and 1 (or 0 and 100)
 * @returns {string}
 */
export function formatPercentage(score) {
  if (score === null || score === undefined) return '—';
  const pct = score <= 1 ? score * 100 : score;
  return `${Math.round(pct)}%`;
}

/**
 * Formats a date string or Date object to a readable locale string.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
