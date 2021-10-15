import React from 'react';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {HeaderProvider} from './prodivers';
import {Navigation} from './foundation';
import {useColorScheme} from 'react-native';

export default function App() {
  const useDarkTheme = useColorScheme() === 'dark';
  const theme = useDarkTheme ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider>
      <HeaderProvider>
        <NavigationContainer theme={theme}>
          <Navigation />
        </NavigationContainer>
      </HeaderProvider>
    </PaperProvider>
  );
}
