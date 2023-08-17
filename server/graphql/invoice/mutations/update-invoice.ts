import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class UpdateInvoiceMutation extends CommonResolver {
  async getData() {
    const { input } = this.args;
    return await this.context.services.invoice.update(input);
  }

  public static getResolver() {
    const generator = new Generator(UpdateInvoiceMutation, []);
    return generator.getResolver();
  }
}
