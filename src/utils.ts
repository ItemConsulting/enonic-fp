import * as EI from "fp-ts/lib/Either";
import { fromEither, IOEither } from "fp-ts/lib/IOEither";

export function fromNullable<E>(
  e: E
): <A>(a: A | null | undefined) => IOEither<E, A> {
  return <A>(a: A | null | undefined): IOEither<E, A> => fromEither(EI.fromNullable(e)(a));
}
