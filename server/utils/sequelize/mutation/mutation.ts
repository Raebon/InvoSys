import { Resolver } from '../../resolvers/abstract/resolver';
import { CommonResolver } from '../../resolvers/base/common';
import { InputValidatorMixin } from '../mixins/input-validator-mixin';

export class MutationResolver extends InputValidatorMixin(Resolver) {
  async prepare() {
    const data: any = {};
    if (this.input) {
      Object.keys(this.model.rawAttributes).forEach((key) => {
        if (typeof this.input[key] !== 'undefined') {
          data[key] = this.input[key];
        }
      });
    }
    return data;
  }
}
