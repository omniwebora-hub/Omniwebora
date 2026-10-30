/** Escape text for safe interpolation into HTML email bodies. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip control characters (except newline/tab) and normalise line endings. */
export function cleanText(input: string): string {
  return input.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

/** Prevent header injection in single-line values (subject, reply-to name). */
export function singleLine(input: string): string {
  return cleanText(input).replace(/[\n\t]+/g, " ").trim();
}
