import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {HeaderProvider} from './prodivers';
import {Navigation} from './foundation';

export default function App() {
  return (
    <PaperProvider>
      <HeaderProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </HeaderProvider>
    </PaperProvider>
  );
}
