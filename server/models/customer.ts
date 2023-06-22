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
      Customer.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      Customer.hasMany(models.Invoice, {
        foreignKey: 'customerId',
      });
    }
  }
  Customer.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Zákazník musí mít křestní jméno' },
          notEmpty: { msg: 'Křestní jméno nesmí být prázdný' },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Zákazník musí mít příjmení' },
          notEmpty: { msg: 'Příjmení nesmí být prázdný' },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'Zákazník musí mít email' },
          notEmpty: { msg: 'Email nesmí být prázdný' },
          isEmail: { msg: 'Email musí být validní' },
        },
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
