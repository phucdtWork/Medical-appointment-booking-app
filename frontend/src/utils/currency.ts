export type Currency = "VND" | "USD";

interface FormatCurrencyOptions {
  currency?: Currency;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Format số tiền thành chuỗi với đơn vị tiền tệ
 * @param amount - Số tiền
 * @param currency - Loại tiền tệ (VND hoặc USD)
 * @returns Chuỗi tiền tệ đã format
 */
export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    currency = "VND",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options;

  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  }

  // VND
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

/**
 * @param vnd - Số tiền VND
 * @returns Số tiền USD
 */
export function vndToUsd(vnd: number): number {
  const EXCHANGE_RATE = 25000; // 1 USD = 25,000 VND
  return Math.round((vnd / EXCHANGE_RATE) * 100) / 100;
}

/**
 * Convert USD sang VND (tỷ giá 1 USD = 25,000 VND)
 * @param usd - Số tiền USD
 * @returns Số tiền VND
 */
export function usdToVnd(usd: number): number {
  const EXCHANGE_RATE = 25000; // 1 USD = 25,000 VND
  return Math.round(usd * EXCHANGE_RATE);
}

/**
 * Format khoảng giá (min-max)
 * @param min - Giá tối thiểu
 * @param max - Giá tối đa
 * @param currency - Loại tiền tệ
 * @returns Chuỗi khoảng giá
 */
export function formatPriceRange(
  min: number,
  max: number,
  currency: Currency = "VND"
): string {
  const minFormatted = formatCurrency(min, { currency });
  const maxFormatted = formatCurrency(max, { currency });
  return `${minFormatted} - ${maxFormatted}`;
}
