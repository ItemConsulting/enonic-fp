type EnonicLibraryMap = import("enonic-types").EnonicLibraryMap;

declare const __non_webpack_require__: <K extends string = string>(path: K) => K extends keyof EnonicLibraryMap
  ? EnonicLibraryMap[K]
  : any;

declare const Java: any;

declare const __: {
  newBean: (bean: string) => any,
  toNativeObject: (beanResult: any) => any
}
