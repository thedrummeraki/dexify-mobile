import React from 'react';
import {ImageBackground, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {CoverSize, findRelationships, mangaImage} from 'src/api';
import {Artist, Author, Manga} from 'src/api/mangadex/types';
import DynamicTabs, {DynamicTab} from 'src/components/DynamicTabs';
import {AboutTab, ChaptersTab, AnimeDetailsTab, DetailsTab} from './components';
import GalleryTab from './components/GalleryTab';

interface Props {
  manga: Manga;
}

export default function ShowMangaDetails({manga}: Props) {
  const theme = useTheme();

  const tabs: DynamicTab[] = [
    {
      title: 'About',
      content: () => <AboutTab manga={manga} />,
    },
    {
      title: 'Read',
      content: () => <ChaptersTab manga={manga} />,
    },
    {
      title: 'Anime',
      content: () => <AnimeDetailsTab manga={manga} />,
    },
    {
      title: 'Details',
      content: () => <DetailsTab manga={manga} />,
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
          backgroundColor: theme.colors.background,
        }}
        tabs={tabs}
        mode="scrollable"
        showLeadingSpace={false}
      />
    </View>
  );
}
