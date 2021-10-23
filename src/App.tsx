import React from 'react';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import {HeaderProvider} from './prodivers';
import {Navigation} from './foundation';
import {useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function App() {
  const useDarkTheme = useColorScheme() === 'dark';
  const theme = useDarkTheme ? DarkTheme : DefaultTheme;

  const cache = new InMemoryCache();
  const client = new ApolloClient({
    uri: 'https://tanoshimu-2.herokuapp.com/graphql',
    cache,
  });

  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView style={{flex: 1}}>
        <PaperProvider>
          <HeaderProvider>
            <NavigationContainer theme={theme}>
              <Navigation />
            </NavigationContainer>
          </HeaderProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </ApolloProvider>
  );
}
