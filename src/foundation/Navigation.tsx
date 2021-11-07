import React, {useContext} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {Home, ShowChapter, ShowManga, ShowMangaGallery} from 'src/screens';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import {Header} from '.';
import {HeaderContext, useUpdatedSession} from 'src/prodivers';

type RootStackParamList = {
  Home: undefined;
  ShowManga: {id: string};
  ShowMangaGallery: {id: string; number?: number};
  ShowChapter: {id: string};
};

type DexifyNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const headerContext = useContext(HeaderContext);
  const {refreshToken} = useUpdatedSession();


  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: ({navigation, route, options}) => (
          <Header
            goBack={navigation.canGoBack() ? navigation.goBack : undefined}
            // title={headerContext.title || options.title || route.name}
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
        focus: () => {
          refreshToken()
        }
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowManga"
        component={ShowManga}
        options={{headerShown: false}} // little hack to avoid showing "ShowManga"
      />
      <Stack.Screen
        name="ShowMangaGallery"
        component={ShowMangaGallery}
        options={{title: 'Covers gallery'}}
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

export function useShowMangaGalleryRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowMangaGallery'>>();
}

export function useShowChapterRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowChapter'>>();
}
