import React, {PropsWithChildren} from 'react';
import {IntlProvider} from 'react-intl';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  Provider as PaperProvider,
  Provider,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Text,
} from 'react-native-paper';
import merge from 'deepmerge';
import {
  GraphQLProvider,
  HeaderProvider,
  LibraryProvider,
  SessionProvider,
  SettingsProvider,
  useSettings,
  ReadingStateProvider,
} from './prodivers';
import {Navigation} from './foundation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function App() {
  return (
    <PaperProvider>
      <SessionProvider>
        <SettingsProvider>
          <GraphQLProvider>
            <GestureHandlerRootView style={{flex: 1}}>
              <HeaderProvider>
                <LibraryProvider>
                  <ThemeProvider>
                    <ReadingStateProvider>
                      <IntlProvider locale="en" textComponent={Text}>
                        <Navigation />
                      </IntlProvider>
                    </ReadingStateProvider>
                  </ThemeProvider>
                </LibraryProvider>
              </HeaderProvider>
            </GestureHandlerRootView>
          </GraphQLProvider>
        </SettingsProvider>
      </SessionProvider>
    </PaperProvider>
  );
}

function ThemeProvider({children}: PropsWithChildren<{}>) {
  const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
  const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

  const {lightTheme} = useSettings();
  const selectedTheme = lightTheme ? CombinedDefaultTheme : CombinedDarkTheme;

  const theme = {
    ...selectedTheme,
    colors: {
      ...selectedTheme.colors,
      primary: 'rgb(255, 103, 64)',
      accent: 'rgb(103, 64, 255)',
      notification: 'rgb(64, 255, 103)',
    },
  };

  return (
    <Provider theme={theme}>
      <NavigationContainer theme={theme}>{children}</NavigationContainer>
    </Provider>
  );
}
