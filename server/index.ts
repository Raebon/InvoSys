import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { GraphQLError } from 'graphql';
import http from 'http';
import db from './db/models';
import { buildContext, schema } from './graphql';
import { Services } from './services';
import { ApolloServerErrorCode } from '@apollo/server/errors';

const app = express();
const httpServer = http.createServer(app);

const myPlugin = {
  async requestDidStart(requestContext: any) {
    console.log(
      `${requestContext.request.operationName} - ${requestContext.request.extensions}`,
    );
  },
};

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), myPlugin],
  formatError: (formattedError: any, error: any) => {
    // Return a different error message
    if (
      formattedError.extensions.code ===
      ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
    ) {
      return {
        ...formattedError,
        message: "Your query doesn't match the schema. Try double-checking it!",
      };
    }
    // Otherwise return the formatted error. This error can also
    // be manipulated in other ways, as long as it's returned.
    return formattedError;
  },
});

app.use(cors<cors.CorsRequest>(), bodyParser.json());
const startServer = async () => {
  db.sequelize.authenticate();
  db.sequelize.options.logging = false;

  console.log('🚀 Connected to DB');
  await server.start();
  console.log('🚀 Apollo server ready');
  app.use(
    '/',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = await Services.getInstance().user.getUser(
          req.headers.authorization,
        );

        if (!user.userId) {
          throw new GraphQLError('Nejste přihlášený', {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          });
        }

        const context = await buildContext(user, Services.getInstance());

        return context;
      },
    }),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve),
  );
  console.log(`🚀 Server ready`);
};

startServer();

app.post('/register', (req, res) => {
  Services.getInstance().user.signOut(req, res);
});

app.post('/login', (req, res) => {
  Services.getInstance().user.signIn(req, res);
});
