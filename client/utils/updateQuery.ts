import { Cache, QueryInput } from "@urql/exchange-graphcache";

function updateQuery<Result, Query>(
  cache: Cache,
  result: any,
  query: QueryInput,
  fn: (r: Result, q: Query | null) => Query | null
) {
  return cache.updateQuery(query, (data: Query | null) => fn(result, data));
}

export default updateQuery;
