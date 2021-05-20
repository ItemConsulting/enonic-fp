import { EnonicEventData, EventLibrary, ListenerParams, SendParams } from "enonic-types/event";

let eventLib = __non_webpack_require__("/lib/xp/event");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: EventLibrary): void {
  eventLib = library;
}

export function listener<A extends object = EnonicEventData>(params: ListenerParams<A>): null {
  return eventLib.listener(params);
}

export function send(params: SendParams): null {
  return eventLib.send(params);
}
