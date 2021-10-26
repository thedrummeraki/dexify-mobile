import React, {PropsWithChildren, useContext, useState} from 'react';
import {ImageBackground, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {CoverSize, findRelationships, mangaImage} from 'src/api';
import {Artist, Author, Manga} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {AboutTab, ChaptersTab, AnimeDetailsTab, GalleryTab} from './components';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

interface Props {
  manga: Manga;
}

interface MangaDetails {
  loading: boolean;
  manga: Manga;
  aggregate?: Manga.VolumeAggregateInfo;
  error?: any;
  coverUrl?: string;
  onCoverUrlUpdate: (coverUrl: string) => void;
}

const ShowMangaDetailsContext = React.createContext<MangaDetails>(
  {} as MangaDetails,
);

function ShowMangaDetailsProvider({
  children,
  ...rest
}: PropsWithChildren<MangaDetails>) {
  return (
    <ShowMangaDetailsContext.Provider value={rest}>
      {children}
    </ShowMangaDetailsContext.Provider>
  );
}

export function useMangaDetails() {
  return useContext(ShowMangaDetailsContext);
}

export default function ShowMangaDetails({manga}: Props) {
  const {data, loading, error} = useGetRequest<Manga.Aggregate>(
    `https://api.mangadex.org/manga/${manga.id}/aggregate?translatedLanguage[]=en`,
  );

  const [coverUrl, setCoverUrl] = useState<string>();

  const aggregate = data?.result === 'ok' ? data.volumes : undefined;

  return (
    <ShowMangaDetailsProvider
      loading={loading}
      aggregate={aggregate}
      manga={manga}
      error={error}
      coverUrl={coverUrl}
      onCoverUrlUpdate={setCoverUrl}>
      <View style={{flex: 1}}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}>
          <ImageBackground
            source={{uri: coverUrl}}
            resizeMode="cover"
            style={{
              flex: 1,
              justifyContent: 'center',
              opacity: 0.175,
            }}
          />
        </View>

        <Tab.Navigator screenOptions={{swipeEnabled: false, lazy: true}}>
          <Tab.Screen name="About" component={AboutTab} />
          <Tab.Screen name="Read" component={ChaptersTab} />
          <Tab.Screen name="Anime" component={AnimeDetailsTab} />
          <Tab.Screen name="Gallery" component={GalleryTab} />
        </Tab.Navigator>
      </View>
    </ShowMangaDetailsProvider>
  );
}

function Test() {
  return <Text>test!</Text>;
}
