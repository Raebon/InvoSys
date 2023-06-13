'use strict';

import { Model } from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Customer
    extends Model<CustomerAttributes>
    implements CustomerAttributes
  {
    id!: string;
    firstName!: string;
    lastName!: string;
    email!: string;

    static associate(models: any) {
      // define association here
      Customer.hasMany(models.Invoice, {
        foreignKey: 'customerId',
      });
    }
  }
  Customer.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Customer',
      tableName: 'Customers',
    },
  );

  return Customer;
};
