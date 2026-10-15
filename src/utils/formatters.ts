/**
 * Indian Rupee (INR) Formatting Utilities
 * Adheres to Indian numbering system (Lakhs and Crores).
 */

export const formatINR = (
  val: number,
  options?: { showSymbol?: boolean; decimals?: number }
): string => {
  const symbol = options?.showSymbol !== false ? '₹' : '';
  const decimals = options?.decimals ?? 2;
  const num = isNaN(val) ? 0 : val;
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${symbol}${formatted}`;
};

export const formatLakhCrore = (val: number): string => {
  if (isNaN(val)) return '₹0.00';
  if (Math.abs(val) >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(val) >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  }
  if (Math.abs(val) >= 1000) {
    return `₹${(val / 1000).toFixed(1)}k`;
  }
  return `₹${val.toFixed(2)}`;
};

export const formatNumberINR = (val: number, decimals: number = 2): string => {
  const num = isNaN(val) ? 0 : val;
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
