import { IO } from "fp-ts/lib/IO";
import { IOEither } from "fp-ts/lib/IOEither";
import { EnonicError } from "./common";
import { catchEnonicError } from "./utils";

const context = __non_webpack_require__("/lib/xp/context");

export interface Context {
  readonly repository: string;
  readonly branch: string;
  readonly authInfo: AuthInfo;
}

interface AuthInfo {
  readonly user: User;
}

interface User {
  readonly type: string;
  readonly key: string;
  readonly displayName: string;
  readonly disabled: boolean;
  readonly email: string;
  readonly login: string;
  readonly idProvider: string;
}

interface RunContext {
  readonly repository?: string;
  readonly branch?: string;
  readonly user?: {
    readonly login: string;
    readonly idProvider?: string;
  };
  readonly principals?: ReadonlyArray<string>;
  readonly attributes?: { readonly [key: string]: string | boolean | number };
}

export function get(): IOEither<EnonicError, Context> {
  return catchEnonicError<Context>(
    () => context.get()
  );
}

export function runUnsafe<A>(runContext: RunContext, f: () => A): A {
  return context.run(runContext, f);
}

export function run<A>(runContext: RunContext): (a: IO<A>) => IO<A> {
  return (a: IO<A>) => (): A => runUnsafe(runContext, a);
}
