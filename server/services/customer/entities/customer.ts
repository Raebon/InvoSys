import { ICustomer } from '../../../interfaces';

export default class CustomerEntity {
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(data: ICustomer) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.createdAt = data.updatedAt;
    this.updatedAt = data.updatedAt;
  }
}
