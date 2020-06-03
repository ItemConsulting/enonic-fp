import {CommonLibrary} from "enonic-types/lib/common";

const lib: CommonLibrary = __non_webpack_require__("/lib/xp/auth");

/**
 * Transform a text string so that it can be safely used in cases where the range of accepted characters is restricted.
 * Some usage examples are: as an XP content or node name, as a principal name, in a URL or in a filesystem path.
 */
export function sanitize(text: string): string {
  return lib.sanitize(text);
}
