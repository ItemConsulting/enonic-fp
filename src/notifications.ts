import type { KeyPair, SendAsyncParams, SendParams } from "/lib/notifications";
import { catchEnonicError, type EnonicError } from "./errors";
import type { IOEither } from "fp-ts/es6/IOEither";
import * as notificationsLib from "/lib/notifications";

/**
 * Generate a VAPID public/private key pair.
 */
export function generateKeyPair(): IOEither<EnonicError, KeyPair> {
  return catchEnonicError(() => notificationsLib.generateKeyPair());
}

/**
 * Send a push notification to a client.
 */
export function send<A extends object | string>(params: SendParams<A>): IOEither<EnonicError, number> {
  return catchEnonicError(() => notificationsLib.send<A>(params));
}

/**
 * Send a push notification to a client. The notification will be sent asynchronously.
 */
export function sendAsync<A extends object | string>(params: SendAsyncParams<A>): IOEither<EnonicError, void> {
  return catchEnonicError(() => notificationsLib.sendAsync<A>(params));
}
