import {IO} from "fp-ts/lib/IO";
import {IOEither} from "fp-ts/lib/IOEither";
import {Context, ContextLibrary, RunContext} from "enonic-types/context";
import {catchEnonicError, EnonicError} from "./errors";

let contextLib = __non_webpack_require__("/lib/xp/context");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: ContextLibrary) {
  contextLib = library;
}

export function get(): IOEither<EnonicError, Context> {
  return catchEnonicError(
    () => contextLib.get()
  );
}

export function runUnsafe<A>(runContext: RunContext, f: () => A): A {
  return contextLib.run(runContext, f);
}

export function run(runContext: RunContext): <A>(a: IO<A>) => IO<A> {
  return <A>(a: IO<A>) => (): A => runUnsafe<A>(runContext, a);
}
