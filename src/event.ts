import type { ListenerParams, SendParams } from "/lib/xp/event";
import * as eventLib from "/lib/xp/event";

export function listener<EventData extends object>(params: ListenerParams<EventData>): void {
  return eventLib.listener<EventData>(params);
}

export function send<EventData extends object = object>(params: SendParams<EventData>): void {
  return eventLib.send<EventData>(params);
}
