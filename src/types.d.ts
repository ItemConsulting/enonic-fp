type LibMap = import("enonic-types/libs").EnonicLibraryMap;

declare const __non_webpack_require__: <L, K extends keyof LibMap | string = string>(
  path: K
) => K extends keyof LibMap ? LibMap[K] : L;

declare const Java: any;

declare const __: {
  newBean: <A>(bean: string) => A;
  toNativeObject: <A>(beanResult: unknown) => A;
};
