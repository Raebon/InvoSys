import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class GetInvoiceById extends CommonResolver {
  async getData() {
    return await this.context.services.invoice.byId(this.args.id);
  }

  public static getResolver() {
    const generator = new Generator(GetInvoiceById, []);

    return generator.getResolver();
  }
}
