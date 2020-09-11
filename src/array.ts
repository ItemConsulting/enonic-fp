export function forceArray<A>(data?: A | Array<A>): Array<A>;
export function forceArray<A>(data?: A | ReadonlyArray<A>): ReadonlyArray<A>;
export function forceArray<A>(data?: A | ReadonlyArray<A>): ReadonlyArray<A> {
  data = data || [];
  return Array.isArray(data)
    ? data
    : [data];
}
