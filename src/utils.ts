import * as EI from "fp-ts/lib/Either";
import {fromEither, IOEither, tryCatch} from "fp-ts/lib/IOEither";
import {EnonicError, GeneralEnonicErrorKey} from "./errors";
import {Lazy} from "fp-ts/lib/function";
import {ById, ByKey, ByPath} from "enonic-types/lib/portal";

export interface Throwable {
  getMessage(): string;

  getLocalizedMessage(): string;

  getCause(): Throwable;
}

const Throwables = Java.type('com.google.common.base.Throwables');

export function fromNullable<E>(
  e: E
): <A>(a: A | null | undefined) => IOEither<E, A> {
  return <A>(a: A | null | undefined): IOEither<E, A> => fromEither(EI.fromNullable(e)(a));
}

export function isJavaThrowable(t: Throwable | unknown): t is Throwable {
  const throwable = t as Throwable;

  return throwable
    && typeof throwable.getMessage === 'function'
    && typeof throwable.getCause === 'function'
    && throwable.getMessage() !== undefined
    && throwable.getCause() !== undefined;
}

export function getMessage(t: Throwable | unknown): string | undefined {
  return isJavaThrowable(t)
    ? t.getMessage()
    : undefined;
}

export function getStackTraceAsString(t: Throwable | unknown): string | undefined {
  return isJavaThrowable(t)
    ? Throwables.getStackTraceAsString(t)
    : undefined;
}

export function getRootCause(t: Throwable | unknown): Throwable | undefined {
  return isJavaThrowable(t)
    ? Throwables.getRootCause(t)
    : undefined;
}

export function handleJavaThrowable(errorKey: GeneralEnonicErrorKey, t: Throwable | string | unknown): EnonicError {
  if (isJavaThrowable(t)) {
    return {
      errorKey,
      stackTrace: getStackTraceAsString(t),
      cause: getMessage(getRootCause(t))
    }
  } else {
    return {
      errorKey,
      cause: String(t)
    }
  }
}

export function catchEnonicError<A>(
  f: Lazy<A>,
  errorKey: GeneralEnonicErrorKey = "InternalServerError"
): IOEither<EnonicError, A> {
  return tryCatch<EnonicError, A>(f, (t) => handleJavaThrowable(errorKey, t));
}

export function isString<A>(a: A | string): a is string {
  return (typeof a === 'string');
}

export function stringToByKey<A>(input: string | A): A | ByKey {
  return isString(input)
    ? {key: input}
    : input;
}

export function stringToById<A>(input: string | A): A | ById {
  return isString(input)
    ? {id: input}
    : input;
}

export function stringToByPath<A>(input: string | A): A | ByPath {
  return isString(input)
    ? {path: input}
    : input;
}
