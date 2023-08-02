import { typeDefs } from './definitions/types';

export class UserSchema {
  static typeDefs = typeDefs;

  static getResolvers() {
    return {
      UserQuery: {},
      Query: {
        invoiceItems: () => {
          return {};
        },
      },
    };
  }
}
