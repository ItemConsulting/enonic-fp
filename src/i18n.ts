import { fromNullable, map, Option } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

const i18n = __non_webpack_require__("/lib/xp/i18n");
const NOT_TRANSLATED_MESSAGE = "NOT_TRANSLATED";

export function getPhrases(
  locale: string | Array<string>,
  bundles: Array<string>
): { [key: string]: string } {
  return i18n.getPhrases(locale, bundles);
}

export function getSupportedLocales(bundles: Array<string>): Array<string> {
  return i18n.getSupportedLocales(bundles);
}

export interface LocalizeParams {
  key: string;
  locale?: string | Array<string>;
  values?: Array<string>;
  bundles?: Array<string>;
  application?: string;
}

export function localize(params: LocalizeParams): Option<string> {
  return pipe(
    fromNullable<string>(i18n.localize(params)),
    map((result: string) =>
      result === NOT_TRANSLATED_MESSAGE ? params.key : result
    )
  );
}
