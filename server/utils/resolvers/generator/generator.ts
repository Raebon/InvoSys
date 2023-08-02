export class Generator {
  constructor(public resolverConstructor: any, public resolverArguments: any) {
    const args = [...arguments];
    this.resolverConstructor = args.shift();
    this.resolverArguments = args;
  }

  resolve(obj: any, args: any, context: any, info: any) {
    const resolver = new (Function.prototype.bind.apply(
      this.resolverConstructor,
      [null, ...this.resolverArguments],
    ))();
    return resolver.resolve(obj, args, context, info);
  }

  getResolver() {
    return (obj: any, args: any, context: any, info: any) => {
      return this.resolve(obj, args, context, info);
    };
  }
}
