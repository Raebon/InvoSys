export class Resolver {
  // noinspection JSMethodCanBeStatic
  args: any;
  obj: any;
  context: any;
  info: any;
  getPayload() {
    throw new Error('Function getPayload must be implemented in child class');
  }

  resolve(obj: any, args: any, context: any, info: any) {
    this.args = args;
    this.obj = obj;
    this.context = context;
    this.info = info;
    return this.getPayload();
  }
}
