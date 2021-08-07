import { cacheExchange } from "@urql/exchange-graphcache";
import { dedupExchange, fetchExchange } from "urql";
import { API_URL } from "../constants/api";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
} from "../generated/graphql";
import updateQuery from "./updateQuery";

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  return {
    url: API_URL,
    fetchOptions: {
      credentials: "include" as const,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            login: (result, _args, cache, _info) => {
              // update me query on login
              updateQuery<LoginMutation, MeQuery>(
                cache,
                result,
                { query: MeDocument },
                (result, query) => {
                  // only update when we have user details
                  if (result.login.user) {
                    return {
                      me: result.login.user,
                    } as any;
                  }
                  return query;
                }
              );
            },
            logout: (result, _args, cache, _info) => {
              updateQuery<LogoutMutation, MeQuery>(
                cache,
                result,
                { query: MeDocument },
                (_r, _q) => ({ me: null })
              );
            },
          },
        },
      }),
      ssrExchange,
      fetchExchange,
    ],
  };
};
