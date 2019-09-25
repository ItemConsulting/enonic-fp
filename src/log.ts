import { IO } from "fp-ts/lib/IO";

export function info(...args: Array<any>): IO<void> {
  return () => log.info(...args);
}

export function warn(...args: Array<any>): IO<void> {
  return () => log.warn(...args);
}

export function error(...args: Array<any>): IO<void> {
  return () => log.error(...args);
}

declare const log: {
  info: (...args: Array<any>) => void;
  warn: (...args: Array<any>) => void;
  error: (...args: Array<any>) => void;
};
