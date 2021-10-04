import { IO } from "fp-ts/IO";
import { IOEither } from "fp-ts/IOEither";
import type { Context, RunContext } from "/lib/xp/context";
import { catchEnonicError, EnonicError } from "./errors";
import * as contextLib from "/lib/xp/context";

export function get(): IOEither<EnonicError, Context> {
  return catchEnonicError(() => contextLib.get());
}

export function runUnsafe<A>(runContext: RunContext, f: () => A): A {
  return contextLib.run(runContext, f);
}

export function run(runContext: RunContext): <A>(a: IO<A>) => IO<A> {
  return <A>(a: IO<A>) =>
    (): A =>
      runUnsafe<A>(runContext, a);
}
