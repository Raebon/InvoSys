'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs');
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('123qwe', 10);
    const transaction = await queryInterface.sequelize.transaction();

    const userId = uuidv4();
    const customerIdA = uuidv4();
    const customerIdB = uuidv4();
    const customerIdC = uuidv4();
    const invoiceA = uuidv4();
    const invoiceB = uuidv4();
    const invoiceC = uuidv4();
    const invoiceD = uuidv4();

    const date = new Date();

    const invoiceADateOfIssue = new Date(date.getTime());
    invoiceADateOfIssue.setDate(date.getDate() - 90);
    const invoiceADateDue = new Date(invoiceADateOfIssue.getTime());
    invoiceADateDue.setDate(invoiceADateOfIssue.getDate() + 30);
    
    const invoiceBDateOfIssue = new Date(date.getTime());
    invoiceBDateOfIssue.setDate(date.getDate() - 60);
    const invoiceBDateDue = new Date(invoiceBDateOfIssue.getTime());
    invoiceBDateDue.setDate(invoiceBDateOfIssue.getDate() + 30);
    
    const invoiceCDateOfIssue = new Date(date.getTime());
    invoiceCDateOfIssue.setDate(date.getDate() - 30);  
    const invoiceCDateDue = new Date(invoiceCDateOfIssue.getTime());
    invoiceCDateDue.setDate(invoiceCDateOfIssue.getDate() + 30);

    const invoiceDDateOfIssue = new Date();
    const invoiceDDateDue = new Date(invoiceDDateOfIssue.getTime());
    invoiceDDateDue.setDate(invoiceDDateOfIssue.getDate()+ 30);

    try {
      await queryInterface.bulkInsert(
        'Users',
        [
          {
            id: userId,
            firstName: 'Dominik',
            lastName: 'Kučera',
            email: 'test@test.cz',
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction },
      );

      await queryInterface.bulkInsert(
        'Customers',
        [
          {
            id: customerIdA,
            userId: userId,
            firstName: 'Tomáš',
            lastName: 'Neznal',
            email: 'tomas@neznal.cz',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: customerIdB,
            userId: userId,
            firstName: 'Pepa',
            lastName: 'Strouhal',
            email: 'pepa@strouhal.cz',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: customerIdC,
            userId: userId,
            firstName: 'Kamila',
            lastName: 'Mokrá',
            email: 'mokra@kamila.cz',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction },
      );

      await queryInterface.bulkInsert(
        'Invoices',
        [
          {
            id: invoiceA,
            userId: userId,
            customerId: customerIdA,
            description: 'Fakturace #1',
            dateOfIssue: invoiceADateOfIssue,
            dueDate: invoiceADateDue,
            variableNumber: 1202301,
            createdAt: invoiceADateOfIssue,
            updatedAt: new Date(),
          },
          {
            id: invoiceB,
            userId: userId,
            customerId: customerIdB,
            description: 'Fakturace #2',
            dateOfIssue: invoiceBDateOfIssue,
            dueDate: invoiceBDateDue,
            variableNumber: 1202302,
            createdAt: invoiceBDateOfIssue,
            updatedAt: new Date(),
          },
          {
            id: invoiceC,
            userId: userId,
            customerId: customerIdC,
            description: 'Fakturace #3',
            dateOfIssue: invoiceCDateOfIssue,
            dueDate: invoiceCDateDue,
            variableNumber: 1202303,
            createdAt: invoiceCDateOfIssue,
            updatedAt: new Date(),
          },
          {
            id: invoiceD,
            userId: userId,
            customerId: customerIdC,
            description: 'Fakturace #3',
            dateOfIssue: invoiceDDateOfIssue,
            dueDate: invoiceDDateDue,
            variableNumber: 1202303,
            createdAt: invoiceDDateOfIssue,
            updatedAt: new Date(),
          },
        ],
        { transaction },
      );

      await queryInterface.bulkInsert(
        'InvoiceItems',
        [
          {
            id: uuidv4(),
            invoiceId: invoiceA,
            name: "Položka",
            unitPrice: 160,
            numberOfItems: 500,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            invoiceId: invoiceB,
            name: "Položka",
            unitPrice: 160,
            numberOfItems: 425,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            invoiceId: invoiceC,
            name: "Položka",
            unitPrice: 160,
            numberOfItems: 475,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            invoiceId: invoiceD,
            name: "Položka",
            unitPrice: 160,
            numberOfItems: 475,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction },
      );
      await transaction.commit();
    } catch (error) {
      console.log(error);
      await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    //todo: odstranit jen založené záznamy
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('InvoiceItems', null, {})
      await queryInterface.bulkDelete(
        'Invoices',
        null,
        { transaction },
      );
      await queryInterface.bulkDelete(
        'Customers',
        null,
        { transaction },
      );
      await queryInterface.bulkDelete('Users', null, { transaction });
      await transaction.commit();
    } catch (error) {
      console.log(error);
      await transaction.rollback();
    }
  },
};
