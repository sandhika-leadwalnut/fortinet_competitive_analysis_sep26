/**
 * Formats numbers with K (thousands) and M (millions) suffixes
 * @param num - The number to format (can be null for data without values)
 * @returns Formatted string with appropriate suffix
 */
export function formatNumber(num: number | null): string {
  if (num === null) return 'no data';
  if (num === 0) return '0';
  
  if (num >= 1000000) {
    // For millions, remove .0 decimal if not needed
    const millions = num / 1000000;
    return millions % 1 === 0 ? `${millions.toFixed(0)}M` : `${millions.toFixed(1)}M`;
  }
  
  if (num >= 1000) {
    // For thousands, remove .0 decimal if not needed
    const thousands = num / 1000;
    return thousands % 1 === 0 ? `${thousands.toFixed(0)}K` : `${thousands.toFixed(1)}K`;
  }
  
  // Numbers below 1000 stay as-is
  return Math.round(num).toString();
}

/**
 * Formats numbers for chart axes - simplified version for cleaner axis labels
 * @param value - The number to format
 * @returns Formatted string with appropriate suffix
 */
export function formatChartAxisNumber(value: number): string {
  if (value === null || value === undefined || value === 0) return '0';
  
  if (value >= 1000000) {
    // For millions, show one decimal if needed, otherwise just the whole number
    const millions = value / 1000000;
    return millions % 1 === 0 ? `${millions.toFixed(0)}M` : `${millions.toFixed(1)}M`;
  }
  
  if (value >= 1000) {
    // For thousands, show one decimal if needed, otherwise just the whole number
    const thousands = value / 1000;
    return thousands % 1 === 0 ? `${thousands.toFixed(0)}K` : `${thousands.toFixed(1)}K`;
  }
  
  // Numbers below 1000 stay as-is
  return Math.round(value).toString();
}