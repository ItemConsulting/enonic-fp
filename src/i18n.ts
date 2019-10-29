import { fromNullable, map, Option } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

const i18n = __non_webpack_require__("/lib/xp/i18n");
const NOT_TRANSLATED_MESSAGE = "NOT_TRANSLATED";

export interface LocalizeParams {
  readonly key: string;
  readonly locale?: string | ReadonlyArray<string>;
  readonly values?: ReadonlyArray<string>;
  readonly bundles?: ReadonlyArray<string>;
  readonly application?: string;
}

export function getPhrases(
  locale: string | ReadonlyArray<string>,
  bundles: ReadonlyArray<string>
): { [key: string]: string } {
  return i18n.getPhrases(locale, bundles);
}

export function getSupportedLocales(bundles: ReadonlyArray<string>): ReadonlyArray<string> {
  return i18n.getSupportedLocales(bundles);
}

export function localize(params: LocalizeParams): Option<string> {
  return pipe(
    fromNullable<string>(i18n.localize(params)),
    map((result: string) =>
      result === NOT_TRANSLATED_MESSAGE ? params.key : result
    )
  );
}
