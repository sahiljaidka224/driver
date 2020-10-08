import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "apollo-utilities";
import { getToken } from "./auth";
import { setContext } from "@apollo/client/link/context";
import { split } from "apollo-link";

const URI = "http://192.168.0.47:4000/";

const httpLink = createUploadLink({
  uri: `${URI}graphql`,
  //   uri: "http://172.20.10.4:4000/graphql/",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await getToken();

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const authorizedLink = authLink.concat(httpLink as any);

const wsLink = new WebSocketLink({
  uri: `ws://192.168.0.47:4000/graphql`,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: async () => ({
      authorization: `Bearer ${await getToken()}`,
    }),
  },
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
  authorizedLink as any
);

const cache = new InMemoryCache();
const client = new ApolloClient({
  link,
  cache,
});
export default client;
