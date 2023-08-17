import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class DeleteInvoiceMutation extends CommonResolver {
  async getData() {
    return this.context.services.invoice.delete(this.args.input);
  }

  public static getResolver() {
    const generator = new Generator(DeleteInvoiceMutation, []);
    return generator.getResolver();
  }
}
