'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 'c769c38a-9961-4271-aa80-96ea987ab6ca',
          firstName: 'Admin',
          lastName: 'Testovací',
          email: 'test@gmail.com',
          password:
            '$2a$12$ZgA6nfSMFKgyZzXdKIYNjuDWeTFQOtRF9VOnKV9NV9xvd55atilqS',
          createdAt: '2023-06-22T16:30:07.592Z',
          updatedAt: '2023-06-22T16:30:07.592Z',
        },
        {
          id: 'c976c38a-9961-4271-aa80-96ea987ab6ce',
          firstName: 'Joe',
          lastName: 'Rude',
          email: 'joe@gmail.com',
          password:
            '$2a$12$ZgA6nfSMFKgyZzXdKIYNjuDWeTFQOtRF9VOnKV9NV9xvd55atilqS',
          createdAt: '2023-06-22T16:30:07.592Z',
          updatedAt: '2023-06-22T16:30:07.592Z',
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Users', null, {});
  },
};
