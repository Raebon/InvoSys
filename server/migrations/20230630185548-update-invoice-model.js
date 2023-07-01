'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'Invoices',
          'variableNumber',
          {
            type: Sequelize.DataTypes.INTEGER,
          },
          { transaction: t },
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Invoices', 'variableNumber', {
          transaction: t,
        }),
      ]);
    });
  },
};
