import db from '../../models';
const bcrypt = require('bcryptjs');
import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');

export const signOut = async (
  req: Request<any, never, SignOutInput>,
  res: Response,
) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const expiresIn: number = 7200;
    if (!(email && password && lastName && firstName)) {
      res.status(400).send({
        error: true,
        message: 'Zadejte všechna povinná pole!',
        token: null,
        expiresIn: 0,
      });
    }

    const oldUser = await db.User.findOne({ where: { email } });

    if (oldUser) {
      return res.status(409).send({
        error: true,
        message: 'Uživatel existuje. Přihlašte se!',
        token: null,
        expiresIn: 0,
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
    });

    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_TOKEN, {
      expiresIn,
      subject: user.id,
    });
    // save user token
    user.token = token;

    // return new user
    return res.status(201).json({
      error: false,
      message: 'Registrace proběhla úspěšně',
      token,
      expiresIn,
    });
  } catch (error) {
    console.log('Error - signOut: ', error);
    return res.status(500).send({
      error: true,
      message: 'Chyba při registraci!',
      token: null,
      expiresIn: 0,
    });
  }
};
