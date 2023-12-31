'use strict';

import { Model } from 'sequelize';
import { IInvoiceItem } from '../../interfaces';

module.exports = (sequelize: any, DataTypes: any) => {
  class InvoiceItem extends Model<IInvoiceItem> implements IInvoiceItem {
    id!: string;
    name!: string;
    unitPrice!: number;
    numberOfItems!: number;

    static associate(models: any) {
      // define association here
      InvoiceItem.belongsTo(models.Invoice, {
        foreignKey: 'invoiceId',
        onDelete: 'cascade',
      });
    }
  }
  InvoiceItem.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unitPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      numberOfItems: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'InvoiceItem',
      tableName: 'InvoiceItems',
      name: {
        singular: 'invoiceItem',
        plural: 'invoiceItems',
      },
    },
  );

  return InvoiceItem;
};
