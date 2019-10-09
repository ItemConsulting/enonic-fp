import { IO } from "fp-ts/lib/IO";

declare const log: {
  info: (...args: Array<any>) => void;
  warn: (...args: Array<any>) => void;
  error: (...args: Array<any>) => void;
};

export function info(...args: Array<any>): IO<void> {
  return (): void => log.info(...args);
}

export function warn(...args: Array<any>): IO<void> {
  return (): void => log.warn(...args);
}

export function error(...args: Array<any>): IO<void> {
  return (): void => log.error(...args);
}

