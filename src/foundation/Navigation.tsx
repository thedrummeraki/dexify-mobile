import React, {useContext} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Home, ShowChapter, ShowManga} from 'src/screens';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import {Header} from '.';
import {HeaderContext} from 'src/prodivers';

type RootStackParamList = {
  Home: undefined;
  ShowManga: {id: string};
  ShowChapter: {id: string};
};

type DexifyNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const headerContext = useContext(HeaderContext);

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: ({navigation, route, options}) => (
          <Header
            goBack={navigation.canGoBack() ? navigation.goBack : undefined}
            title={headerContext.title || options.title || route.name}
            subtitle={headerContext.subtitle || undefined}
          />
        ),
      }}
      screenListeners={{
        beforeRemove: () =>
          headerContext.setState(state => ({
            ...state,
            title: '',
            hideHeader: true,
          })),
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowManga"
        component={ShowManga}
        options={{title: ' '}} // little hack to avoid showing "ShowManga"
      />
      <Stack.Screen
        name="ShowChapter"
        component={ShowChapter}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export function useDexifyNavigation() {
  return useNavigation<DexifyNavigationProp>();
}

export function useShowMangaRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowManga'>>();
}

export function useShowChapterRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowChapter'>>();
}
