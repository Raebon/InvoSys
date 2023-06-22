import { ApolloServer } from '@apollo/server';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/schema';
import db from '../models';
import { GraphQLError } from 'graphql';
import { signOut, signIn } from './controllers';
const jwt = require('jsonwebtoken');
const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

app.use(cors<cors.CorsRequest>(), bodyParser.json());
const startServer = async () => {
  db.sequelize.authenticate();
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
        const user = getUser(req.headers.authorization);

        if (!user.userId) {
          throw new GraphQLError('Nejste přihlášený', {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          });
        }
        return { user };
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
  signOut(req, res);
});

app.post('/login', (req, res) => {
  signIn(req, res);
});

const getUser = (token: string | string[] | undefined) => {
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
