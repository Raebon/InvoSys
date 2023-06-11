'use strict';

import { Model } from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Invoice extends Model<InvoiceAttributes> implements InvoiceAttributes {
    id!: string;
    customerId!: string;
    description!: string;
    dateOfIssue!: Date;

    static associate(models: any) {
      // define association here
      Invoice.belongsTo(models.Customer, {
        foreignKey: 'customerId'
      })
      Invoice.hasMany(models.InvoiceItem, { foreignKey: 'invoiceId' })
    }
  };

  Invoice.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Customers",
        key: "id"
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateOfIssue: {
      type: DataTypes.DATEONLY,
    }
  }, {
    sequelize,
    modelName: "Invoice",
    tableName: "Invoices"
  });

  return Invoice
}