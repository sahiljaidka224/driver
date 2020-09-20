import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { split } from "apollo-link";

const httpLink = new HttpLink({
  uri: "http://192.168.0.45:4000/graphql",
  //   uri: "http://172.20.10.4:4000/graphql/",
});

const wsLink = new WebSocketLink({
  uri: `ws://192.168.0.45:4000/graphql`,
  options: {
    reconnect: true,
    lazy: true,
  },
  //   connectionParams: {
  //     authToken: user.authToken,
  //   },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const cache = new InMemoryCache();
const client = new ApolloClient({
  link,
  cache,
});
export default client;
