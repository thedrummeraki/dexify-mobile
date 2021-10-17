import React, {useContext} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Home, ShowChapter, ShowManga} from 'src/screens';
import {
  RouteProp,
  useNavigation as useReactNavigation,
  useRoute,
} from '@react-navigation/core';
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
            hideHeader={headerContext.hideHeader}
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
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="ShowManga"
        component={ShowManga}
        options={{title: 'Loading...'}}
      />
      <Stack.Screen name="ShowChapter" component={ShowChapter} />
    </Stack.Navigator>
  );
}

export function useDexifyNavigation() {
  return useReactNavigation<DexifyNavigationProp>();
}

export function useShowMangaRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowManga'>>();
}

export function useShowChapterRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowChapter'>>();
}
