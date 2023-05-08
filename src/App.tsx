import React, {PropsWithChildren} from 'react';
import {IntlProvider} from 'react-intl';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import {
  Provider as PaperProvider,
  Provider,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Text,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import merge from 'deepmerge';
import {
  GraphQLProvider,
  HeaderProvider,
  LibraryProvider,
  SessionProvider,
  SettingsProvider,
  ReadingStateProvider,
  useMangadexSettings,
} from './prodivers';
import {Navigation} from './foundation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar as RNStatusBar} from 'react-native';

import {Theme as PaperTheme} from 'react-native-paper/src/types';
import {MangadexTheme} from './api/mangadex/types';

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
                        <StatusBar />
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
  const CombinedDefaultTheme = merge<PaperTheme, NavigationTheme>(
    PaperDefaultTheme,
    NavigationDefaultTheme,
  );
  const CombinedDarkTheme = merge<PaperTheme, NavigationTheme>(
    PaperDarkTheme,
    NavigationDarkTheme,
  );

  // const {lightTheme} = useSettings();
  let {
    userPreferences: {theme: preferedTheme},
  } = useMangadexSettings();

  const {dark} = usePaperTheme();

  if (preferedTheme === MangadexTheme.System) {
    preferedTheme = dark ? MangadexTheme.Dark : MangadexTheme.Light;
  }

  const selectedTheme =
    preferedTheme === MangadexTheme.Dark ||
    preferedTheme === MangadexTheme.Slate
      ? CombinedDarkTheme
      : CombinedDefaultTheme;

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

export function useTheme(): PaperTheme & NavigationTheme {
  return usePaperTheme() as PaperTheme & NavigationTheme;
}

function StatusBar() {
  const {
    colors: {background},
    dark,
  } = useTheme();

  return (
    <RNStatusBar
      backgroundColor={background}
      barStyle={dark ? 'light-content' : 'dark-content'}
    />
  );
}
