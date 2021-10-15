import React from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {
  Provider as PaperProvider,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {HeaderProvider} from './prodivers';
import {Navigation} from './foundation';

export default function App() {
  return (
    <PaperProvider>
      <HeaderProvider>
        <NavigationContainer theme={DarkTheme}>
          <Navigation />
        </NavigationContainer>
      </HeaderProvider>
    </PaperProvider>
  );
}
