'use strict';

import { Model } from 'sequelize';
import { IUser } from '../../interfaces';

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<IUser> implements IUser {
    id!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;

    static associate(models: any) {
      // define association here
      User.hasMany(models.Invoice, {
        foreignKey: 'userId',
      });
      User.hasMany(models.Customer, {
        foreignKey: 'userId',
      });
    }
  }
  User.init(
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
          notNull: { msg: 'Uživatel musí mít křestní jméno' },
          notEmpty: { msg: 'Křestní jméno nesmí být prázdný' },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Uživatel musí mít příjmení' },
          notEmpty: { msg: 'Příjmení nesmí být prázdný' },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'Uživatel musí mít email' },
          notEmpty: { msg: 'Email nesmí být prázdný' },
          isEmail: { msg: 'Email musí být validní' },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      name: {
        singular: 'user',
        plural: 'users',
      },
    },
  );

  return User;
};
