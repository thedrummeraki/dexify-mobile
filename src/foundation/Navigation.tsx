import React, {useContext} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  Home,
  ShowArtist,
  ShowChapter,
  ShowManga,
  ShowMangaGallery,
  ShowMangaList,
  AddToPlaylist,
  ShowCustomList,
} from 'src/screens';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import {Header} from '.';
import {HeaderContext, useUpdatedSession} from 'src/prodivers';
import {Manga, MangaRequestParams} from 'src/api/mangadex/types';

type MangaParams = Partial<Omit<Manga, 'type' | 'id'>> & {id: string};

type RootStackParamList = {
  Home: undefined;
  ShowManga: MangaParams;
  AddToPlaylist: {manga: Manga};
  ShowMangaGallery: {id: string; number?: number};
  ShowChapter: {id: string};
  ShowArtist: {id: string; allowHentai?: boolean};
  ShowMangaList: {
    title?: string;
    description?: string;
    ids?: string[];
    params?: MangaRequestParams;
  };
  ShowCustomList: {id: string};
};

export type DexifyNavigationProp = NativeStackNavigationProp<
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
        header: ({navigation}) => (
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
          refreshToken();
        },
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowManga"
        component={ShowManga}
        options={{headerShown: false}}
      />
      <Stack.Screen name="AddToPlaylist" component={AddToPlaylist} />
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
      <Stack.Screen
        name="ShowArtist"
        component={ShowArtist}
        options={{headerShown: false}}
      />
      <Stack.Screen name="ShowMangaList" component={ShowMangaList} />
      <Stack.Screen
        name="ShowCustomList"
        component={ShowCustomList}
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

export function useAddToPlaylistRoute() {
  return useRoute<RouteProp<RootStackParamList, 'AddToPlaylist'>>();
}

export function useShowMangaGalleryRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowMangaGallery'>>();
}

export function useShowChapterRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowChapter'>>();
}

export function useShowArtistRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowArtist'>>();
}

export function useShowMangaListRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowMangaList'>>();
}

export function useShowCustomListRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowCustomList'>>();
}
