export function forceArray<A>(data?: A | Array<A> | null | undefined): Array<A>;
export function forceArray<A>(data?: A | ReadonlyArray<A> | null | undefined): ReadonlyArray<A>;
export function forceArray<A>(data?: A | Array<A> | null | undefined): ReadonlyArray<A> {
  data = data ?? [];
  return Array.isArray(data) ? data : [data];
}
