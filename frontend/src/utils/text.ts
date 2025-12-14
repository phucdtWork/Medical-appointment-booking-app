/**
 * Cắt ngắn text nếu vượt quá độ dài tối đa
 * @param text - Chuỗi text cần cắt
 * @param maxLength - Độ dài tối đa
 * @param suffix - Hậu tố khi cắt (mặc định là "...")
 * @returns Chuỗi đã được cắt
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (!text || text.length <= maxLength) {
    return text;
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
  text: string,
  breakpoints: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  } = {}
): {
  mobile: string;
  tablet: string;
  desktop: string;
} {
  const defaults = {
    mobile: 15,
    tablet: 25,
    desktop: 40,
    ...breakpoints,
  };

  return {
    mobile: truncateText(text, defaults.mobile),
    tablet: truncateText(text, defaults.tablet),
    desktop: truncateText(text, defaults.desktop),
  };
}

/**
 * Hiển thị tooltip khi text quá dài
 * @param text - Chuỗi text
 * @param maxLength - Độ dài tối đa
 * @returns Object với text đã cắt và full text
 */
export function getTextWithTooltip(text: string, maxLength: number) {
  const truncated = truncateText(text, maxLength);
  const shouldShowTooltip = text.length > maxLength;

  return {
    display: truncated,
    tooltip: text,
    shouldShowTooltip,
  };
}
