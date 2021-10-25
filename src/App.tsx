import React from 'react';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import {GraphQLProvider, HeaderProvider, SessionProvider} from './prodivers';
import {Navigation} from './foundation';
import {useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function App() {
  const useDarkTheme = useColorScheme() === 'dark';
  const theme = useDarkTheme ? DarkTheme : DefaultTheme;

  return (
    <SessionProvider>
      <GraphQLProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <PaperProvider>
            <HeaderProvider>
              <NavigationContainer theme={theme}>
                <Navigation />
              </NavigationContainer>
            </HeaderProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      </GraphQLProvider>
    </SessionProvider>
  );
}
