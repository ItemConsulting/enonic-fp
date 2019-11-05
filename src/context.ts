import { IO } from "fp-ts/lib/IO";
import { IOEither } from "fp-ts/lib/IOEither";
import { EnonicError } from "./errors";
import { catchEnonicError } from "./utils";
import { Context, ContextLibrary, RunContext } from "enonic-types/lib/context";

const contextLib: ContextLibrary = __non_webpack_require__("/lib/xp/context");

export function get(): IOEither<EnonicError, Context> {
  return catchEnonicError<Context>(
    () => contextLib.get()
  );
}

export function runUnsafe<A>(runContext: RunContext, f: () => A): A {
  return contextLib.run(runContext, f);
}

export function run<A>(runContext: RunContext): (a: IO<A>) => IO<A> {
  return (a: IO<A>) => (): A => runUnsafe(runContext, a);
}
