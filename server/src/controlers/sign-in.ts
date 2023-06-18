import db from '../../models';
import { Request, Response } from 'express';
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

export const signIn = async (
  req: Request<any, never, SignInInput>,
  res: Response,
) => {
  try {
    const { email, password } = req.body;

    // validace input
    if (!(email && password)) {
      res.status(400).send('Všechna pole jsou povinná!');
    }

    // zjištění existence usera v DB

    const user = await db.User.findOne({ where: { email } });

    // -> pokud existuje uživatel a shodují se hesla z DB tak vytvoř token

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_TOKEN,
        {
          expiresIn: '2h',
        },
      );

      // -> uložit token
      user.token = token;
      // vrátit token
      return res.status(200).json(user);
    }
    return res.status(400).send('Špatné údaje');
  } catch (error) {
    console.log('Error - signIn: ', error);
    return res.status(500).send('Chyba při přihlašování!');
  }
};
