import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class getRevenueLastThreeMonthsResolver extends CommonResolver {
  async getData() {
    return await this.context.services.invoice.lastThreeMonthsRevenue(
      this.context.auth.userId,
    );
  }

  public static getResolver() {
    const generator = new Generator(getRevenueLastThreeMonthsResolver, []);

    return generator.getResolver();
  }
}
