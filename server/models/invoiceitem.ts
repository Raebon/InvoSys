'use strict';

import { Model } from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class InvoiceItem extends Model<InvoiceItemAttributes> implements InvoiceItemAttributes {
    id!: string;
    invoiceId!: string;
    name!: string;
    unitPrice!: number;
    numberOfItems!: number;

    static associate(models: any) {
      // define association here
      InvoiceItem.belongsTo(models.Invoice, {
        foreignKey: 'invoiceId'
      })
    }
  };
  InvoiceItem.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    invoiceId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Invoices",
        key: "id"
      },
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
      allowNull: false
    }
  }, {
    sequelize,
    modelName: "InvoiceItem",
    tableName: "InvoiceItems"
  })

  return InvoiceItem
}