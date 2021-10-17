import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Header from './Header';
import {Home} from '../screens';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator
      initialRouteName="Dexify"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
