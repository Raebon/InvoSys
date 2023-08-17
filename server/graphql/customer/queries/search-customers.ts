import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator/generator';

export class SearchCustomersResolver extends CommonResolver {
  async getData() {
    return this.context.services.customer.searchCustomer({
      userId: this.context.auth.userId,
      filterText: this.args.text,
    });
  }

  public static getResolver() {
    const generator = new Generator(SearchCustomersResolver, []);
    return generator.getResolver();
  }
}
