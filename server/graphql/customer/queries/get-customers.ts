import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class GetCustomersResolver extends CommonResolver {
  async getData() {
    return this.context.services.customer.getCustomers(
      this.context.auth.userId,
    );
  }

  public static getResolver() {
    const generator = new Generator(GetCustomersResolver, []);

    return generator.getResolver();
  }
}
