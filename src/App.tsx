import React from 'react';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {
  GraphQLProvider,
  HeaderProvider,
  LibraryProvider,
  SessionProvider,
} from './prodivers';
import {Navigation} from './foundation';
import {useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function App() {
  const useDarkTheme = useColorScheme() === 'dark';
  const theme = useDarkTheme ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider>
      <SessionProvider>
        <GraphQLProvider>
          <GestureHandlerRootView style={{flex: 1}}>
            <HeaderProvider>
              <LibraryProvider>
                <NavigationContainer theme={theme}>
                  <Navigation />
                </NavigationContainer>
              </LibraryProvider>
            </HeaderProvider>
          </GestureHandlerRootView>
        </GraphQLProvider>
      </SessionProvider>
    </PaperProvider>
  );
}
