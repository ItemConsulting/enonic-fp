import { fromPredicate, Option } from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import type { LocalizeParams } from "/lib/xp/i18n";
import { stringToByKey } from "./utils";
import { findFirstMap } from "fp-ts/Array";
import * as i18nLib from "/lib/xp/i18n";

const NOT_TRANSLATED_MESSAGE = "NOT_TRANSLATED";

/**
 * Returns an object of key/value-pairs for all phrases with the given locales in the specified bundles.
 */
export function getPhrases(
  locale: string | ReadonlyArray<string>,
  bundles: ReadonlyArray<string>
): { [key: string]: string } {
  return i18nLib.getPhrases(locale, bundles);
}

/**
 * Returns the list of supported locale codes for the specified bundles.
 */
export function getSupportedLocales(bundles: ReadonlyArray<string>): ReadonlyArray<string> {
  return i18nLib.getSupportedLocales(bundles);
}

/**
 * Localizes a phrase searching through the list of passed in locales in the given order, to find a translation for the
 * phrase-key.
 *
 * If no translation is found, the default phrase will be used.
 *
 * Some phrases will have placeholders for values that may be inserted into the phrase. These must be provided in the
 * function call for those phrases.
 */
export function localizeUnsafe(params: LocalizeParams): string;
export function localizeUnsafe(key: string): string;
export function localizeUnsafe(paramsOrKey: LocalizeParams | string): string;
export function localizeUnsafe(paramsOrKey: LocalizeParams | string): string {
  const params = stringToByKey(paramsOrKey);
  return i18nLib.localize(params);
}

/**
 * Localizes a phrase searching through the list of passed in locales in the given order, to find a translation for the
 * phrase-key.
 *
 * If no translation is found, `none` is returned.
 *
 * Some phrases will have placeholders for values that may be inserted into the phrase. These must be provided in the
 * function call for those phrases.
 */
export function localize(params: LocalizeParams): Option<string>;
export function localize(key: string): Option<string>;
export function localize(paramsOrKey: LocalizeParams | string): Option<string>;
export function localize(paramsOrKey: LocalizeParams | string): Option<string> {
  return pipe(
    localizeUnsafe(paramsOrKey),
    fromPredicate((result: string) => result !== NOT_TRANSLATED_MESSAGE)
  );
}

/**
 * Returns the first hit of a list of localized strings
 */
export function localizeFirst(keys: Array<string | LocalizeParams>): Option<string> {
  return findFirstMap(localize)(keys);
}
