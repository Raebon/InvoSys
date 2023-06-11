import db from '../../models';
import { customers } from "../../seeders/customers"

export const createCustomers = () => {
  console.log("create customers")
  customers.map(customer => {
    db.Customer.create(customer)
  })
}

export const getCustomers = async ():Promise<Customer[]> => {
  const customerData = await db.Customer.findAll()

  const customers = await customerData.map((customer:Customer) => {
    return {
      id: customer.id,
      firsName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
    }
  })

  return customers
}