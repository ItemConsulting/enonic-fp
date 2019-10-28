import { IO } from "fp-ts/lib/IO";
import { IOEither } from "fp-ts/lib/IOEither";
import { EnonicError } from "./common";
import { catchEnonicError } from "./utils";

const context = __non_webpack_require__("/lib/xp/context");

export interface Context {
  repository: string;
  branch: string;
  authInfo: AuthInfo;
}

interface AuthInfo {
  user: User;
}

interface User {
  type: string;
  key: string;
  displayName: string;
  disabled: boolean;
  email: string;
  login: string;
  idProvider: string;
}

export function get(): IOEither<EnonicError, Context> {
  return catchEnonicError<Context>(
    () => context.get()
  );
}

interface RunContext {
  repository?: string;
  branch?: string;
  user?: {
    login: string;
    idProvider?: string;
  };
  principals?: Array<string>;
  attributes?: { [key: string]: string | boolean | number };
}

export function runUnsafe<A>(runContext: RunContext, f: () => A): A {
  return context.run(runContext, f);
}

export function run<A>(runContext: RunContext): (a: IO<A>) => IO<A> {
  return (a: IO<A>) => (): A => runUnsafe(runContext, a);
}
