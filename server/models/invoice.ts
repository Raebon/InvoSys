'use strict';

import { Model } from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Invoice extends Model<InvoiceAttributes> implements InvoiceAttributes {
    id!: string;
    description!: string;
    dateOfIssue!: Date;

    static associate(models: any) {
      // define association here
      Invoice.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      Invoice.belongsTo(models.Customer, { foreignKey: 'customerId' });
      Invoice.hasMany(models.InvoiceItem, { foreignKey: 'invoiceId' });
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
    },
    {
      sequelize,
      modelName: 'Invoice',
      tableName: 'Invoices',
    },
  );

  return Invoice;
};
