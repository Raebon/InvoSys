import { Request, Response } from 'express';
import { IUser } from '../../interfaces';
import { UserModel } from './model/user-model';
import { Instance } from '../_instance';

export class UserService {
  constructor(protected services: Instance) {}
  public async getUser(token: string | string[] | undefined) {
    if (!token) {
      throw new Error('Session invalid');
    }
    try {
      return UserModel.getUser(token);
    } catch (error) {
      throw new Error('Session invalid');
    }
  }

  public async signOut(
    req: Request<any, never, Omit<IUser, 'id'>>,
    res: Response,
  ) {
    try {
      return UserModel.signOut(req, res);
    } catch (error) {
      console.error('Error - signOut: ', error);
      return res.status(500).send({
        error: true,
        message: 'Chyba při registraci!',
        token: null,
        expiresIn: 0,
      });
    }
  }

  public async signIn(
    req: Request<any, never, Omit<IUser, 'id' | 'firstName' | 'lastName'>>,
    res: Response,
  ) {
    try {
      return UserModel.signIn(req, res);
    } catch (error) {
      console.error('Error - signIn: ', error);
      return res.status(500).send({
        error: true,
        message: 'Chyba při přihlašování!',
        token: null,
        expiresIn: 0,
      });
    }
  }
}
