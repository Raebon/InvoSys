import { ICustomer, ISearchCustomersInput } from '../../interfaces/customer';
import { IListResponse } from '../../interfaces/response';
import { Instance } from '../_instance';
import { CustomerModel } from './model/customer-model';

export class CustomerService {
  constructor(protected services: Instance) {}

  /**
   * @param ISearchCustomersInput
   * @returns {Promise.<ICustomer>}
   */
  public async searchCustomer(
    input: ISearchCustomersInput,
  ): Promise<IListResponse<ICustomer>> {
    try {
      return await CustomerModel.searchCustomer(input);
    } catch (error) {
      console.error('Chyba při vyhledávání zákazníků:', error);
      throw new Error('Nepodařilo se vyhledat zákazníky.');
    }
  }

  /**
   * @param ISearchCustomersInput
   * @returns {Promise.<ICustomer[]>}
   */
  public async getCustomers(userId: string): Promise<IListResponse<ICustomer>> {
    try {
      const customers = await CustomerModel.getCustomers(userId);
      return customers;
    } catch (error) {
      console.error('Chyba při získávání zákazníku:', error);
      throw new Error('Nepodařilo se získat zákazníky.');
    }
  }
}
