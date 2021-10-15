import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Header from './Header';
import {Home} from '../screens';

const Stack = createNativeStackNavigator();

// const NavigationHeader = ({scene, previous, navigation}) => {

// }

export default function Navigation() {
  return (
    <Stack.Navigator
      initialRouteName="Dexify"
      screenOptions={{
        header: ({navigation, route}) => (
          <Header
            title={route.name}
            goBack={navigation.canGoBack() ? navigation.pop : undefined}
          />
        ),
      }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
