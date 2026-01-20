/**
 * Cắt ngắn text nếu vượt quá độ dài tối đa
 * @param text - Chuỗi text cần cắt
 * @param maxLength - Độ dài tối đa
 * @param suffix - Hậu tố khi cắt (mặc định là "...")
 * @returns Chuỗi đã được cắt
 */
export function truncateText(
  text: string | undefined | null,
  maxLength: number,
  suffix: string = "...",
): string {
  if (!text || text.length <= maxLength) {
    return text || "";
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Cắt ngắn text với breakpoint khác nhau
 * @param text - Chuỗi text
 * @param breakpoints - Độ dài tối đa ở các breakpoint
 * @returns Hàm trả về text đã cắt theo breakpoint
 */
export function truncateByBreakpoint(
  text: string | undefined | null,
  breakpoints: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  } = {},
): {
  mobile: string;
  tablet: string;
  desktop: string;
} {
  const safeText = text || "";
  const defaults = {
    mobile: 15,
    tablet: 25,
    desktop: 40,
    ...breakpoints,
  };

  return {
    mobile: truncateText(safeText, defaults.mobile),
    tablet: truncateText(safeText, defaults.tablet),
    desktop: truncateText(safeText, defaults.desktop),
  };
}

/**
 * Hiển thị tooltip khi text quá dài
 * @param text - Chuỗi text
 * @param maxLength - Độ dài tối đa
 * @returns Object với text đã cắt và full text
 */
export function getTextWithTooltip(
  text: string | undefined | null,
  maxLength: number,
) {
  const safeText = text || "";
  const truncated = truncateText(safeText, maxLength);
  const shouldShowTooltip = safeText.length > maxLength;

  return {
    display: truncated,
    tooltip: safeText,
    shouldShowTooltip,
  };
}
