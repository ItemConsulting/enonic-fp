import * as commonLib from "/lib/xp/common";

/**
 * Transform a text string so that it can be safely used in cases where the range of accepted characters is restricted.
 * Some usage examples are: as an XP content or node name, as a principal name, in a URL or in a filesystem path.
 */
export function sanitize(text: string): string {
  return commonLib.sanitize(text);
}
