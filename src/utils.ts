import * as JSON from "fp-ts/es6/Json";
import * as EI from "fp-ts/es6/Either";
import * as IOE from "fp-ts/es6/IOEither";
import { pipe } from "fp-ts/es6/function";
import type { ById, ByKey, ByPath } from "/lib/xp/portal";
import type { EnonicError } from "./errors";
import * as O from "fp-ts/es6/Option";

export function fromNullable<E = EnonicError>(e: E): <A>(a: A | null | undefined) => IOE.IOEither<E, A> {
  return <A>(a: A | null | undefined): IOE.IOEither<E, A> => IOE.fromEither(EI.fromNullable(e)(a));
}

export function fromIOEither<E, A>(ma: IOE.IOEither<E, A>): O.Option<A> {
  return O.fromEither<A>(ma());
}

export function parseJSON<E = EnonicError>(s: string, onError: (reason: unknown) => E): IOE.IOEither<E, JSON.Json> {
  return pipe(JSON.parse(s), EI.mapLeft(onError), IOE.fromEither);
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
