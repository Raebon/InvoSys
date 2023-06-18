import db from '../../models';
const bcrypt = require('bcryptjs');
import { Request, Response } from 'express';
var jwt = require('jsonwebtoken');

export const signOut = async (
  req: Request<any, never, SignOutInput>,
  res: Response,
) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(email && password && lastName && firstName)) {
      res.status(400).send('Všechny pole jsou povinná!');
    }

    const oldUser = await db.User.findOne({ where: { email } });

    if (oldUser) {
      return res.status(409).send('Uživatel již existuje. Prosím přihlašte se');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_TOKEN, {
      expiresIn: '2h',
    });

    // save user token
    user.token = token;

    // return new user
    return res.status(201).json(token);
  } catch (error) {
    console.log('Error - signOut: ', error);
    return res.status(500).send('Chyba při registraci uživatele!');
  }
};
