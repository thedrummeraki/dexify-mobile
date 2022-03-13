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
  ShowCustomList,
  ShowMangaByTags,
  ShowScanlationGroup,
  ShowSettings,
  ShowAnimeSimulcastMangaList,
} from 'src/screens';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import {HeaderContext} from 'src/prodivers';
import {Manga, MangaRequestParams} from 'src/api/mangadex/types';

type MangaParams = Partial<Omit<Manga, 'type' | 'id'>> & {id: string};

type RootStackParamList = {
  Home: undefined;
  ShowManga: MangaParams & {isAiring?: boolean; jumpToVolume?: string | null};
  ShowMangaGallery: {manga: Manga; number?: number};
  ShowChapter: {id: string; jumpToPage?: number};
  ShowArtist: {id: string; allowHentai?: boolean};
  ShowScanlationGroup: {id: string; allowHentai?: boolean};
  ShowMangaList: {
    title?: string;
    description?: string;
    ids?: string[];
    params?: MangaRequestParams;
  };
  ShowAnimeSimulcastMangaList: undefined;
  ShowCustomList: {id: string};
  ShowMangaByTags: {tags: Manga.Tag[]};
  ShowSettings: undefined;
};

export type DexifyNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const headerContext = useContext(HeaderContext);

  return (
    <Stack.Navigator
      initialRouteName="Home"
      // screenOptions={{
      //   header: ({navigation}) => (
      //     <Header
      //       goBack={navigation.canGoBack() ? navigation.goBack : undefined}
      //       // title={headerContext.title || options.title || route.name}
      //       subtitle={headerContext.subtitle || undefined}
      //     />
      //   ),
      // }}
    >
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
      <Stack.Screen
        name="ShowMangaGallery"
        component={ShowMangaGallery}
        options={{headerShown: false}}
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
      <Stack.Screen
        name="ShowScanlationGroup"
        component={ShowScanlationGroup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowMangaList"
        component={ShowMangaList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowAnimeSimulcastMangaList"
        component={ShowAnimeSimulcastMangaList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowCustomList"
        component={ShowCustomList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowMangaByTags"
        component={ShowMangaByTags}
        options={{headerShown: false}}
      />
      <Stack.Screen name="ShowSettings" component={ShowSettings} />
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

export function useShowArtistRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowArtist'>>();
}

export function useShowScanlationGroupRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowScanlationGroup'>>();
}

export function useShowMangaListRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowMangaList'>>();
}

export function useShowCustomListRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowCustomList'>>();
}

export function useShowMangaByTagsRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowMangaByTags'>>();
}
