import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format large numbers with B/M/K suffixes for readability
 * e.g., 500000000000 -> "500B", 125500000000 -> "125.5B"
 */
export function formatCompactNumber(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  
  if (absValue >= 1_000_000_000_000) {
    const num = absValue / 1_000_000_000_000;
    return `${sign}${num >= 100 ? num.toFixed(0) : num.toFixed(1)}T`;
  }
  if (absValue >= 1_000_000_000) {
    const num = absValue / 1_000_000_000;
    return `${sign}${num >= 100 ? num.toFixed(0) : num.toFixed(1)}B`;
  }
  if (absValue >= 1_000_000) {
    const num = absValue / 1_000_000;
    return `${sign}${num >= 100 ? num.toFixed(0) : num.toFixed(1)}M`;
  }
  if (absValue >= 1_000) {
    const num = absValue / 1_000;
    return `${sign}${num >= 100 ? num.toFixed(0) : num.toFixed(1)}K`;
  }
  return `${sign}${absValue.toLocaleString()}`;
}

/**
 * Format currency with symbol and compact number
 * e.g., formatCurrency(500000000000, "$") -> "$500B"
 */
export function formatCurrency(value: number, symbol: string): string {
  const formatted = formatCompactNumber(Math.abs(value));
  return value < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}
