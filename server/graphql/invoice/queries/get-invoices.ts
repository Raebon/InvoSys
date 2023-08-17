import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class GetInvoices extends CommonResolver {
  async getData() {
    return await this.context.services.invoice.getList({
      userId: this.context.auth.userId,
      body: this.args.body,
    });
  }

  public static getResolver() {
    const generator = new Generator(GetInvoices, []);

    return generator.getResolver();
  }
}
