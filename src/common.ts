import {CommonLibrary} from "enonic-types/common";

let commonLib = __non_webpack_require__("/lib/xp/common");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: CommonLibrary) {
  commonLib = library;
}

/**
 * Transform a text string so that it can be safely used in cases where the range of accepted characters is restricted.
 * Some usage examples are: as an XP content or node name, as a principal name, in a URL or in a filesystem path.
 */
export function sanitize(text: string): string {
  return commonLib.sanitize(text);
}
