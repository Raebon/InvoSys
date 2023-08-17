import { Instance } from './_instance';

export class Services {
  static getInstance() {
    return new Instance();
  }
}
