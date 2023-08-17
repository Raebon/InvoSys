import { IAddInvoiceInput } from '../../../interfaces/invoice';
import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class AddInvoiceMutation extends CommonResolver {
  async getData() {
    const input: IAddInvoiceInput = {
      ...this.args.input,
      userId: this.context.auth.userId,
    };

    return await this.context.services.invoice.create(input);
  }

  public static getResolver() {
    const generator = new Generator(AddInvoiceMutation, []);
    return generator.getResolver();
  }
}
