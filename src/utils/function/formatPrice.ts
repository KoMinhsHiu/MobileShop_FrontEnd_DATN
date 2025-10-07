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
  return parseFloat(priceString.replace(/[^\d.-]/g, '')) || 0;
};

