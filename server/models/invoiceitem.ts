'use strict';

import { Model } from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class InvoiceItem
    extends Model<InvoiceItemAttributes>
    implements InvoiceItemAttributes
  {
    id!: string;
    name!: string;
    unitPrice!: number;
    numberOfItems!: number;

    static associate(models: any) {
      // define association here
      InvoiceItem.belongsTo(models.Invoice, {
        foreignKey: 'invoiceId',
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
    },
  );

  return InvoiceItem;
};
