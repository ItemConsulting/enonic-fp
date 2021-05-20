import { KeyPair, NotificationsLibrary, SendAsyncParams, SendParams } from "enonic-types/notifications";
import { catchEnonicError, EnonicError } from "./errors";
import { IOEither } from "fp-ts/IOEither";

let notificationsLib: NotificationsLibrary = __non_webpack_require__("/lib/notifications");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: NotificationsLibrary): void {
  notificationsLib = library;
}

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
