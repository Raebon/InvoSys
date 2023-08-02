export class GeneratorAsync {
  arguments: any;
  argumentsLoaded: boolean;
  constructor(public resolverConstructor: any, public argumentsCallback: any) {
    this.resolverConstructor = resolverConstructor;
    this.argumentsCallback =
      argumentsCallback ||
      (() => {
        return [];
      });
    this.arguments = null;
    this.argumentsLoaded = false;
  }

  async resolve(obj: any, args: any, context: any, info: any) {
    if (!this.argumentsLoaded) {
      this.arguments = await this.argumentsCallback();
      this.argumentsLoaded = true;
    }
    const resolver = new (Function.prototype.bind.apply(
      this.resolverConstructor,
      [null, ...this.arguments],
    ))();
    return resolver.resolve(obj, args, context, info);
  }

  getResolver() {
    return (obj: any, args: any, context: any, info: any) => {
      return this.resolve(obj, args, context, info);
    };
  }
}
