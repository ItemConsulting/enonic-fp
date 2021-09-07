import { catchEnonicError, EnonicError } from "./errors";
import { IOEither } from "fp-ts/IOEither";
import * as websocketLib from "/lib/xp/websocket";

/**
 * Add an id to a socket group.
 */
export function addToGroup(group: string, id: string): IOEither<EnonicError, void> {
  return catchEnonicError(() => websocketLib.addToGroup(group, id));
}

/**
 * Remove an id from a socket group.
 */
export function removeFromGroup(group: string, id: string): IOEither<EnonicError, void> {
  return catchEnonicError(() => websocketLib.removeFromGroup(group, id));
}

/**
 * Send message directly to a socket id.
 */
export function send(id: string, message: string): IOEither<EnonicError, void> {
  return catchEnonicError(() => websocketLib.send(id, message));
}

/**
 * Send message to all sockets in group.
 */
export function sendToGroup(group: string, message: string): IOEither<EnonicError, void> {
  return catchEnonicError(() => websocketLib.sendToGroup(group, message));
}
