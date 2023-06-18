import { Op } from 'sequelize';
import db from '../../models';
import { users } from '../../seeders/users';

export const createUsers = async () => {
  try {
    await Promise.all(
      users.map((user) => {
        return db.User.create(user);
      }),
    );
  } catch (error) {
    console.error('Chyba při vytváření uživatelů:', error);
    throw new Error('Nepodařilo se vytvořit uživatele.');
  }
};
