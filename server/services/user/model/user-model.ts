const jwt = require('jsonwebtoken');
import { Request, Response } from 'express';
import { IUser } from '../../../interfaces';
import db from '../../../db/models';
import UserEntity from '../entities/user';
const bcrypt = require('bcryptjs');

export class UserModel {
  public static async getUser(token: string | string[] | undefined) {
    return jwt.verify(token, process.env.JWT_TOKEN);
  }

  public static async signOut(
    req: Request<any, never, Omit<IUser, 'id'>>,
    res: Response,
  ) {
    const newUser = new UserEntity(req.body);

    const expiresIn: number = 7200;
    if (
      !(
        newUser.email &&
        newUser.password &&
        newUser.lastName &&
        newUser.firstName
      )
    ) {
      res.status(400).send({
        error: true,
        message: 'Zadejte všechna povinná pole!',
        token: null,
        expiresIn: 0,
      });
    }

    const oldUser = await db.User.findOne({ where: { email: newUser.email } });

    if (oldUser) {
      return res.status(409).send({
        error: true,
        message: 'Uživatel existuje. Přihlašte se!',
        token: null,
        expiresIn: 0,
      });
    }

    const encryptedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = encryptedPassword;

    const user = await db.User.create(newUser);

    const token = jwt.sign(
      { userId: user.id, email: newUser.email },
      process.env.JWT_TOKEN,
      {
        expiresIn,
        subject: user.id,
      },
    );

    return res.status(201).json({
      error: false,
      message: 'Registrace proběhla úspěšně',
      token,
      expiresIn,
    });
  }

  public static async signIn(
    req: Request<any, never, Omit<IUser, 'id' | 'firstName' | 'lastName'>>,
    res: Response,
  ) {
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
  }
}
