import {EnonicEventData, ListenerParams, SendParams} from "enonic-types/lib/event";

const eventLib = __non_webpack_require__("/lib/xp/event");

export function listener<A extends object = EnonicEventData>(params: ListenerParams<A>): null {
  return eventLib.listener(params);
}

export function send(params: SendParams): null {
  return eventLib.send(params);
}

