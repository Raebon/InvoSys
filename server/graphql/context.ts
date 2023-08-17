import { Instance } from '../services/_instance';

const fields = require('graphql-fields');

const context = {
  fields,
};

export const buildContext = async (auth: any, services: Instance) => {
  return {
    ...context,
    auth,
    services,
  };
};
