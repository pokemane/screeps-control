export default class FnHelper {
  public static defineCachedGetter(proto: object, propertyName: string, fn: (arg: any) => void ) {
    Object.defineProperty(proto, propertyName, {
      get: () => {
        if (this === proto || this === undefined) { return; }
        const result = fn.call(this, this);
        Object.defineProperty(this, propertyName, {
          value: result,
          configurable: true,
          enumerable: false
        });
        return result;
      }
    });
  }
}
