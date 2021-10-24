import React from 'react';
import {ImageBackground, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {CoverSize, findRelationships, mangaImage} from 'src/api';
import {Artist, Author, Manga} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import DynamicTabs, {DynamicTab} from 'src/components/DynamicTabs';
import {AboutTab, ChaptersTab, AnimeDetailsTab, GalleryTab} from './components';

interface Props {
  manga: Manga;
}

export default function ShowMangaDetails({manga}: Props) {
  const theme = useTheme();

  const {data, loading, error} = useGetRequest<Manga.Aggregate>(
    `https://api.mangadex.org/manga/${manga.id}/aggregate?translatedLanguage[]=en`,
  );

  const aggregate = data?.result === 'ok' ? data.volumes : undefined;

  const tabs: DynamicTab[] = [
    {
      title: 'About',
      content: () => (
        <AboutTab loading={loading} manga={manga} aggregate={aggregate} />
      ),
    },
    {
      title: 'Read',
      content: () => (
        <ChaptersTab
          manga={manga}
          aggregate={aggregate}
          loading={loading}
          error={error}
        />
      ),
    },
    {
      title: 'Anime',
      content: () => <AnimeDetailsTab manga={manga} />,
    },
    {
      title: 'Gallery',
      content: () => <GalleryTab manga={manga} />,
    },
  ];

  return (
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
          source={{uri: mangaImage(manga, {size: CoverSize.Original})}}
          resizeMode="cover"
          style={{
            flex: 1,
            justifyContent: 'center',
            opacity: 0.175,
          }}
        />
      </View>

      <DynamicTabs
        style={{
          backgroundColor: `${theme.colors.background}00`,
        }}
        tabs={tabs}
        mode="scrollable"
        showLeadingSpace={false}
      />
    </View>
  );
}
