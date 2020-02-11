import {EnonicEventData, EventLibrary, ListenerParams, SendParams} from "enonic-types/lib/event";

const contentLib: EventLibrary = __non_webpack_require__("/lib/xp/content");

export function listener<A extends object = EnonicEventData>(params: ListenerParams<A>): null {
  return contentLib.listener(params);
}

export function send(params: SendParams): null {
  return contentLib.send(params);
}

