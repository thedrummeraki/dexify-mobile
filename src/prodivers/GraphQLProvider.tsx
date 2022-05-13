import {InMemoryCache, ApolloClient, ApolloProvider} from '@apollo/client';
import React, {PropsWithChildren} from 'react';

export default function GraphQLProvider({children}: PropsWithChildren<{}>) {
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    uri: 'https://proxy.youranime.moe/graphql',
    cache,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
