import {IO} from "fp-ts/lib/IO";

declare const log: {
  readonly info: (...args: ReadonlyArray<any>) => void;
  readonly warn: (...args: ReadonlyArray<any>) => void;
  readonly error: (...args: ReadonlyArray<any>) => void;
};

export function info(...args: ReadonlyArray<any>): IO<void> {
  return (): void => log.info(...args);
}

export function warn(...args: ReadonlyArray<any>): IO<void> {
  return (): void => log.warn(...args);
}

export function error(...args: ReadonlyArray<any>): IO<void> {
  return (): void => log.error(...args);
}

