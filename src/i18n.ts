import {fromNullable, map, Option} from "fp-ts/lib/Option";
import {pipe} from "fp-ts/lib/pipeable";
import {I18nLibrary, LocalizeParams} from "enonic-types/lib/i18n";
import {stringToByKey} from "./utils";

const i18nLib: I18nLibrary = __non_webpack_require__("/lib/xp/i18n");
const NOT_TRANSLATED_MESSAGE = "NOT_TRANSLATED";

export function getPhrases(
  locale: string | ReadonlyArray<string>,
  bundles: ReadonlyArray<string>
): { [key: string]: string } {
  return i18nLib.getPhrases(locale, bundles);
}

export function getSupportedLocales(bundles: ReadonlyArray<string>): ReadonlyArray<string> {
  return i18nLib.getSupportedLocales(bundles);
}

export function localize(params: LocalizeParams): Option<string>;
export function localize(key: string): Option<string>;
export function localize(paramsOrKey: LocalizeParams | string): Option<string> {
  const params = stringToByKey(paramsOrKey);

  return pipe(
    params,
    i18nLib.localize,
    fromNullable,
    map((result: string) =>
      result === NOT_TRANSLATED_MESSAGE ? params.key : result
    )
  );
}
