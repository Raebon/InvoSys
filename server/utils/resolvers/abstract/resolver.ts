import { Instance } from '../../../services/_instance';

interface ContextI {
  auth: {
    userId: string;
    email: string;
    iat: number;
    exp: number;
    sub: string;
  };
  fields: any;
  services: Instance;
}

export class Resolver {
  args: any;
  obj: any;
  context!: ContextI;
  info: any;

  getPayload() {
    throw new Error('Function getPayload must be implemented in child class');
  }

  resolve(obj: any, args: any, context: ContextI, info: any) {
    this.args = args;
    this.obj = obj;
    this.context = context;
    this.info = info;
    return this.getPayload();
  }
}
