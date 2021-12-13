import { IO } from "fp-ts/IO";
import { IOEither } from "fp-ts/IOEither";
import type { Context, RunContext } from "/lib/xp/context";
import { catchEnonicError, EnonicError } from "./errors";
import * as contextLib from "/lib/xp/context";
import { ContextAttributes } from "*/lib/xp/context";

export function get<Attributes extends ContextAttributes>(): IOEither<EnonicError, Context<Attributes>> {
  return catchEnonicError(() => contextLib.get());
}

export function runUnsafe<A, Attributes extends ContextAttributes>(runContext: RunContext<Attributes>, f: () => A): A {
  return contextLib.run(runContext, f);
}

export function run<Attributes extends ContextAttributes>(runContext: RunContext<Attributes>): <A>(a: IO<A>) => IO<A> {
  return <A>(a: IO<A>) =>
    (): A =>
      runUnsafe<A, Attributes>(runContext, a);
}
