export const formatCurrency = (amount: number): string => {
  // Handles formatting numbers into a full INR currency string, e.g., 1234.56 -> ₹1,234.56
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatCurrencyShort = (amount: number): string => {
    // Handles formatting numbers into a compact INR currency string, e.g., 123456 -> ₹1.2L
    if (Math.abs(amount) >= 1e7) {
        return `₹${(amount / 1e7).toFixed(1)}Cr`;
    }
    if (Math.abs(amount) >= 1e5) {
        return `₹${(amount / 1e5).toFixed(1)}L`;
    }
    if (Math.abs(amount) >= 1e3) {
        return `₹${(amount / 1e3).toFixed(1)}K`;
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};
