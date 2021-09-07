declare const Java: any;

declare const __: {
  newBean: <A>(bean: string) => A;
  toNativeObject: <A>(beanResult: unknown) => A;
};
