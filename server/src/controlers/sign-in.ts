import db from '../../models';
import { Request, Response } from 'express';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

export const signIn = async (
  req: Request<any, never, SignInInput>,
  res: Response<LoginResponse>,
) => {
  try {
    const { email, password } = req.body;

    const expiresIn: number = 7200;
    // validace input
    if (!(email && password)) {
      res.status(400).send({
        error: true,
        message: 'Zadejte povinná pole!',
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
    console.log('Error - signIn: ', error);
    return res.status(500).send({
      error: true,
      message: 'Chyba při přihlašování!',
      token: null,
      expiresIn: 0,
    });
  }
};
