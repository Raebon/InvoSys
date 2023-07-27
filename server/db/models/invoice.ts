'use strict';

import { Model } from 'sequelize';

type InvoiceModel = Omit<
  IInvoice,
  'user' | 'customer' | 'invoiceItems' | 'customerId'
>;

module.exports = (sequelize: any, DataTypes: any) => {
  class Invoice extends Model<InvoiceModel> implements InvoiceModel {
    id!: string;
    description!: string;
    dateOfIssue!: Date;
    variableNumber!: number;
    dueDate!: Date;

    static associate(models: any) {
      // define association here
      Invoice.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      Invoice.belongsTo(models.Customer, {
        foreignKey: 'customerId',
      });
      Invoice.hasMany(models.InvoiceItem, {
        foreignKey: 'invoiceId',
      });
    }
  }

  Invoice.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfIssue: {
        type: DataTypes.DATEONLY,
      },
      dueDate: {
        type: DataTypes.DATEONLY,
      },
      variableNumber: {
        allowNull: true,
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Invoice',
      tableName: 'Invoices',
      name: {
        singular: 'invoice',
        plural: 'invoices',
      },
    },
  );

  return Invoice;
};
