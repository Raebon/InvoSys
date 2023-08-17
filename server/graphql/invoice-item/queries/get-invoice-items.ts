import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class GetInvoiceItemsResolver extends CommonResolver {
  async getData() {
    return await this.context.services.invoiceItem.getList();
  }

  public static getResolver() {
    const generator = new Generator(GetInvoiceItemsResolver, []);

    return generator.getResolver();
  }
}
