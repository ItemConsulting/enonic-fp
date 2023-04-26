import { IO } from "fp-ts/es6/IO";
import { IOEither } from "fp-ts/es6/IOEither";
import type { Context, ContextParams } from "/lib/xp/context";
import { catchEnonicError, type EnonicError } from "./errors";
import * as contextLib from "/lib/xp/context";

export function get(): IOEither<EnonicError, Context> {
  return catchEnonicError(() => contextLib.get());
}

export function runUnsafe<A>(runContext: ContextParams, f: () => A): A {
  return contextLib.run(runContext, f);
}

export function run(runContext: ContextParams): <A>(a: IO<A>) => IO<A> {
  return <A>(a: IO<A>) =>
    (): A =>
      runUnsafe<A>(runContext, a);
}
