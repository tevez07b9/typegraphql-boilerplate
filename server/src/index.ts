import "reflect-metadata";
import "dotenv-safe/config";
import express from "express";
import cors from "cors";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema, Query, Resolver } from "type-graphql";
import { Context } from "./types";
import { UserResolver } from "./resolvers/User";

// Type for Session Object
declare module "express-session" {
  export interface SessionData {
    userID: number;
  }
}

@Resolver()
class HelloResolver {
  @Query(() => String)
  hello() {
    return "hello world";
  }
}

const main = async () => {
  // Create connection with DB
  await createConnection();

  const app = express();

  // Redis setup
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.set("trust proxy", 1);

  // Cors setup
  app.use(
    cors({
      origin: [
        process.env.CORS_ORIGIN as string,
        "https://studio.apollographql.com",
      ],
      credentials: true,
    })
  );

  // Express session setup
  app.use(
    session({
      name: process.env.COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: false,
        sameSite: "lax",
        secure: false,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false,
    })
  );

  // Apollo server init
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({
      req,
      res,
      redis,
    }),
  });

  // V3 update
  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(parseInt(process.env.PORT as string), () => {
    console.log(`
      Server started on http://localhost:${process.env.PORT}/graphql  
    `);
  });
};

main().catch((err) => {
  console.log(err);
}); //
