import { Resolver } from '../abstract/resolver';

export class CommonResolver extends Resolver {
  getData() {}
  getPayload() {
    return this.getData();
  }
}
