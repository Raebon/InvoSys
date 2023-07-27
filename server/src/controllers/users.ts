import db from '../../db/models';
const bcrypt = require('bcryptjs');
import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');

export const getUser = (token: string | string[] | undefined) => {
  if (token) {
    try {
      // return the user information from the token
      return jwt.verify(token, process.env.JWT_TOKEN);
    } catch (err) {
      // if there's a problem with the token, throw an error
      throw new Error('Session invalid');
    }
  }
};

type RequiredRegisterUserInfo = Omit<IUser, 'id'>;

export const signOut = async (
  req: Request<any, never, RequiredRegisterUserInfo>,
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
    console.error('Error - signOut: ', error);
    return res.status(500).send({
      error: true,
      message: 'Chyba při registraci!',
      token: null,
      expiresIn: 0,
    });
  }
};

type RequiredLoginUserInfo = Omit<IUser, 'id' | 'firstName' | 'lastName'>;

export const signIn = async (
  req: Request<any, never, RequiredLoginUserInfo>,
  res: Response<LoginResponse>,
) => {
  try {
    const { email, password } = req.body;

    const expiresIn: number = 7200;
    // validace input
    if (!(email && password)) {
      res.status(400).send({
        error: true,
        message: 'Zadejte všechna povinná pole!',
        token: null,
        expiresIn: 0,
      });
    }

    // zjištění existence usera v DB

    const user = await db.User.findOne({ where: { email } });

    // -> pokud existuje uživatel a shodují se hesla z DB tak vytvoř token
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { userId: user.id, email },
        process.env.JWT_TOKEN,
        {
          expiresIn,
          subject: user.id,
        },
      );

      // vrátit token
      return res.status(200).json({
        error: false,
        message: 'Přihlášení proběhlo úspěšně!',
        token: token,
        expiresIn,
      });
    }
    return res.status(400).send({
      error: true,
      message: 'Zadejte povinná pole!',
      token: null,
      expiresIn: 0,
    });
  } catch (error) {
    console.error('Error - signIn: ', error);
    return res.status(500).send({
      error: true,
      message: 'Chyba při přihlašování!',
      token: null,
      expiresIn: 0,
    });
  }
};
