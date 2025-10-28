/**
 * Format price to Vietnamese currency format
 * @param price - Price in number format
 * @returns Formatted price string in VND
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

/**
 * Parse price string to number (remove currency symbols)
 * @param priceString - Price string with currency symbols
 * @returns Numeric price value
 */
export const parsePrice = (priceString: string): number => {
  // Remove all non-digit characters except decimal point
  const cleaned = priceString.replace(/[^\d.-]/g, '');
  
  // Handle Vietnamese number format (42.000.000 -> 42000000)
  // Split by decimal point and check if it's a decimal number or thousand separator
  const parts = cleaned.split('.');
  
  if (parts.length === 2 && parts[1].length <= 2) {
    // This is likely a decimal number (e.g., "42.50")
    return parseFloat(cleaned) || 0;
  } else {
    // This is likely thousand separators (e.g., "42.000.000")
    const numberString = parts.join('');
    return parseFloat(numberString) || 0;
  }
};

