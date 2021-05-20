import { Lazy } from "fp-ts/function";
import { IOEither, tryCatch } from "fp-ts/IOEither";

// Implementation of RFC 7807
export interface EnonicError {
  /**
   *  a URL to a document describing the error condition (optional, and "about:blank" is assumed if none is provided;
   *  should resolve to a human-readable document).
   */
  readonly type: string;

  /**
   *  A human-readable description of the specific error.
   */
  readonly detail?: string;

  /**
   * A short, human-readable title for the general error type; the title should not change for given types.
   */
  readonly title: string;

  /**
   *  Conveying the HTTP status code; this is so that all information is in one place, but also to correct for changes
   *  in the status code due to the usage of proxy servers. The status member, if present, is only advisory as
   *  generators MUST use the same status code in the actual HTTP response to assure that generic HTTP software that
   *  does not understand this format still behaves correctly.
   */
  readonly status: number;

  /**
   * This optional key may be present, with a unique URI for the specific error; this will often point to an error log
   * for that specific response.
   */
  readonly instance?: string;

  /**
   * This optional array contains a list of error messages. Messages also have a key, so that each message can be
   * associated with a field in a 400 (Bad Request) error case.
   */
  readonly errors?: ReadonlyArray<ErrorDetail>;
}

/**
 * This object contains more information about the error. This can either be messages from the Java-backend,
 * or in cases in the 400 error range, it can be keys that doesn't validate, and a message.
 */
export interface ErrorDetail {
  /**
   * The key of a field that has failed. Typically corresponds to the `name` of an <input>-field.
   */
  readonly key?: string;

  /**
   *  A message explaining what is wrong with the field with the key
   */
  readonly message: string;
}

export function isEnonicError(value: unknown): value is EnonicError {
  const valueError = value as EnonicError;
  return valueError.type !== undefined && valueError.title !== undefined && valueError.status !== undefined;
}

export const badRequestError: EnonicError = {
  type: "https://problem.item.no/xp/bad-request-error",
  title: "Bad Request Error",
  status: 400,
};

export const notFoundError: EnonicError = {
  type: "https://problem.item.no/xp/not-found",
  title: "Not Found",
  status: 404,
};

export const internalServerError: EnonicError = {
  type: "https://problem.item.no/xp/internal-server-error",
  title: "Internal Server Error",
  status: 500,
};

export const brokenTemplateError: EnonicError = {
  type: "https://problem.item.no/xp/broken-template-error",
  title: "Broken Template Error",
  status: 500,
};

export const missingIdProviderError: EnonicError = {
  type: "https://problem.item.no/xp/missing-id-provider",
  title: "Missing id provider in context",
  status: 500,
};

export const publishError: EnonicError = {
  type: "https://problem.item.no/xp/publish-error",
  title: "Can't publish content",
  status: 500,
};

export const unPublishError: EnonicError = {
  type: "https://problem.item.no/xp/unpublish-error",
  title: "Can't unpublish content",
  status: 500,
};

export const badGatewayError: EnonicError = {
  type: "https://problem.item.no/xp/bad-gateway",
  title: "Bad Gateway Error",
  status: 502,
};

const Throwables = Java.type("com.google.common.base.Throwables");

const JAVA_EXCEPTION_MAP: { [className: string]: EnonicError | undefined } = {
  "com.enonic.xp.node.NodeNotFoundException": notFoundError,
  "org.thymeleaf.exceptions.TemplateInputException": brokenTemplateError,
};

export interface Throwable {
  getMessage(): string;
  getLocalizedMessage(): string;
  getCause(): Throwable;
  getClass(): {
    getName(): string;
  };
}

export function isJavaThrowable(t: Throwable | unknown): t is Throwable {
  const throwable = t as Throwable;

  return (
    throwable &&
    typeof throwable.getMessage === "function" &&
    typeof throwable.getCause === "function" &&
    throwable.getMessage() !== undefined &&
    throwable.getCause() !== undefined
  );
}

export function catchEnonicError<A>(
  f: Lazy<A>,
  defaultError: EnonicError = internalServerError
): IOEither<EnonicError, ReturnType<typeof f>> {
  return tryCatch<EnonicError, ReturnType<typeof f>>(f, (t) => {
    return isJavaThrowable(t) ? throwableToEnonicError(t, defaultError) : defaultError;
  });
}

export function throwableToEnonicError(t: Throwable, defaultError: EnonicError): EnonicError {
  const rootCauseClassName = getRootCause(t).getClass().getName();
  const baseError = JAVA_EXCEPTION_MAP[rootCauseClassName] ?? defaultError;

  return {
    ...baseError,
    detail: getRootCause(t).getMessage(),
    errors: getCausalChain(t).map((ex) => ({
      key: ex.getClass().getName(),
      message: ex.getMessage(),
    })),
  };
}

export function getRootCause(t: Throwable): Throwable {
  return Throwables.getRootCause(t);
}

export function getCausalChain(t: Throwable): Array<Throwable> {
  return __.toNativeObject(Throwables.getCausalChain(t));
}
