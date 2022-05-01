import { ApolloClient, InMemoryCache } from "@apollo/client";

export function createClient(baseUrl: string) {
  const client = new ApolloClient({
    uri: baseUrl + "/graphql",
    cache: new InMemoryCache(),
  });
  return client;
}
