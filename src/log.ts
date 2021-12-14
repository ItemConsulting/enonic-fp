import { IO } from "fp-ts/es6/IO";

declare const log: {
  readonly info: (...args: ReadonlyArray<unknown>) => void;
  readonly warn: (...args: ReadonlyArray<unknown>) => void;
  readonly error: (...args: ReadonlyArray<unknown>) => void;
};

export function info(...args: ReadonlyArray<unknown>): IO<void> {
  return (): void => log.info(...args);
}

export function warn(...args: ReadonlyArray<unknown>): IO<void> {
  return (): void => log.warn(...args);
}

export function error(...args: ReadonlyArray<unknown>): IO<void> {
  return (): void => log.error(...args);
}
