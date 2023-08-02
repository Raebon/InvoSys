import { MutationResolver } from './mutation';

export class CreateResolver extends MutationResolver {
  create(prepared: any) {
    return this.model.create(prepared);
  }

  retrieve(prepared: any) {
    return this.create(prepared);
  }
}
