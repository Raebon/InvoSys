import { IUser } from '../../../interfaces';

export default class UserEntity {
  public id?: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;

  constructor(data: IUser | Omit<IUser, 'id'>) {
    if ('id' in data) {
      this.id = data.id;
    }
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.password = data.password;
  }
}
