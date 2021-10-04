import type { EnonicEventData, ListenerParams, SendParams } from "/lib/xp/event";
import * as eventLib from "/lib/xp/event";

export function listener<A extends object = EnonicEventData>(params: ListenerParams<A>): null {
  return eventLib.listener(params);
}

export function send(params: SendParams): null {
  return eventLib.send(params);
}
