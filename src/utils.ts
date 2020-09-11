import * as EI from "fp-ts/lib/Either";
import {fromEither, IOEither} from "fp-ts/lib/IOEither";
import {ById, ByKey, ByPath} from "enonic-types/portal";
import {EnonicError} from "./errors";

export function fromNullable<E = EnonicError>(
  e: E
): <A>(a: A | null | undefined) => IOEither<E, A> {
  return <A>(a: A | null | undefined): IOEither<E, A> => fromEither(EI.fromNullable(e)(a));
}

export function parseJSON<E = EnonicError>(s: string, onError: (reason: unknown) => E): IOEither<E, EI.Json> {
  return fromEither(EI.parseJSON<E>(s, onError))
}

export function isString<A>(a: A | string): a is string {
  return (typeof a === 'string');
}

export function substringAfter(str: string, divider: string): string {
  return str.substring(str.lastIndexOf(divider) + 1)
}

export function stringToByKey<A>(input: string | A): A | ByKey {
  return isString(input)
    ? {key: input}
    : input;
}

export function stringToById<A>(input: string | A): A | ById {
  return isString(input)
    ? {id: input}
    : input;
}

export function stringToByPath<A>(input: string | A): A | ByPath {
  return isString(input)
    ? {path: input}
    : input;
}
