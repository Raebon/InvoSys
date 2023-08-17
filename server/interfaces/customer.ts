export interface ICustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISearchCustomersInput {
  userId: string;
  filterText: string;
}
