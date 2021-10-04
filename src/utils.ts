import * as JSON from "fp-ts/Json";
import * as EI from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { fromEither, IOEither } from "fp-ts/IOEither";
import { ById, ByKey, ByPath } from "/lib/xp/portal";
import { EnonicError } from "./errors";
import * as O from "fp-ts/Option";

export function fromNullable<E = EnonicError>(e: E): <A>(a: A | null | undefined) => IOEither<E, A> {
  return <A>(a: A | null | undefined): IOEither<E, A> => fromEither(EI.fromNullable(e)(a));
}

export function fromIOEither<E, A>(ma: IOEither<E, A>): O.Option<A> {
  return O.fromEither<A>(ma());
}

export function parseJSON<E = EnonicError>(s: string, onError: (reason: unknown) => E): IOEither<E, JSON.Json> {
  return pipe(JSON.parse(s), EI.mapLeft(onError), fromEither);
}

export function isString<A>(a: A | string): a is string {
  return typeof a === "string";
}

export function substringAfter(str: string, divider: string): string {
  return str.substring(str.lastIndexOf(divider) + 1);
}

export function stringToByKey<A>(input: string | A): A | ByKey {
  return isString(input) ? { key: input } : input;
}

export function stringToById<A>(input: string | A): A | ById {
  return isString(input) ? { id: input } : input;
}

export function stringToByPath<A>(input: string | A): A | ByPath {
  return isString(input) ? { path: input } : input;
}
