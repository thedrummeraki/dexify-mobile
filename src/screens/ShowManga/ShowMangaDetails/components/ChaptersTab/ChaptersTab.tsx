import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Menu,
  Subheading,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';
import {Manga, PagedResultsList, Chapter} from 'src/api/mangadex/types';
import {useGetRequest, useLazyGetRequest} from 'src/api/utils';
import {Banner} from 'src/components';
import BasicList from 'src/components/BasicList';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {useBackgroundColor} from 'src/components/colors';
import {useDexifyNavigation} from 'src/foundation';
import ChaptersGridLayout from './ChaptersGridLayout';
import ChaptersImagesLayout from './ChaptersImagesLayout';

interface Props {
  manga: Manga;
  loading: boolean;
  aggregate?: Manga.VolumeAggregateInfo;
  error?: any;
}

enum Layout {
  Grid = 'Grid',
  Images = 'Images',
}

const layoutIcons: {[key in Layout]: string} = {
  [Layout.Grid]: 'grid',
  [Layout.Images]: 'image',
};

export default function ChaptersTab({manga, loading, aggregate, error}: Props) {
  const [showBanner] = useState(true);
  const [layout, setLayout] = useState<Layout>(Layout.Images);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentVolume, setCurrentVolume] = useState<string>();
  const aggregateEntries = aggregate ? Object.entries(aggregate) : [];

  const volumes = aggregateEntries.map(([volume, _]) => volume);
  const selectedVolumeBackgroundColor = useBackgroundColor('primary');
  const selectedLayoutBackgroundColor = useBackgroundColor('accent');

  const [getChapters, {data, loading: chaptersLoading, error: chaptersError}] =
    useLazyGetRequest<PagedResultsList<Chapter>>();

  useEffect(() => {
    setCurrentVolume(volumes[0]);
  }, []);

  useEffect(() => {
    if (currentVolume) {
      getChapters(
        `https://api.mangadex.org/chapter?limit=100&volume[]=${currentVolume}&manga=${manga.id}&translatedLanguage[]=en&contentRating[]=${manga.attributes.contentRating}`,
      );
    }
  }, [currentVolume]);

  const chaptersCount = data?.result === 'ok' ? data.total : 0;

  // 1 per line = 1 chapter
  // 2 per line = 2, 3 and 4 chapters
  // 4 per line = 5+ chapters

  useEffect(() => {
    if (data?.result === 'ok') {
      setChapters(data.data);
    } else {
      setChapters([]);
    }
  }, [data]);

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (error) {
    return <Text>Uh oh, could not fetch chapters for this manga.</Text>;
  }

  if (aggregateEntries.length === 0) {
    return (
      <ScrollView>
        {Object.entries(manga.attributes.links || {}).length && (
          <Banner
            visible={showBanner}
            background="accent"
            title="Support the manga industry"
            body="If possible, support the author and consider buying from the official publisher."
            // primaryAction={{
            //   content: 'Learn more',
            //   onAction: () => console.log('yee!!...?'),
            // }}
            // onDismiss={() => setShowBanner(false)}
          />
        )}
        <Banner
          background="error"
          title="No chapters found"
          body="Looks like no chapters have been uploaded to Mangadex... yet!"
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{flex: 1}}>
      <Banner
        visible={showBanner}
        background="accent"
        title="Support the manga industry"
        body="If you enjoy reading this manga, consider buying from the official publisher."
        // primaryAction={{
        //   content: 'Learn more',
        //   onAction: () => console.log('yee!!...?'),
        // }}
        // onDismiss={() => setShowBanner(false)}
      />
      <CategoriesCollectionSection
        horizontal
        data={[Layout.Images, Layout.Grid]}
        renderItem={item => (
          <Chip
            disabled={chaptersLoading}
            selected={layout === item}
            icon={layoutIcons[item]}
            style={{
              backgroundColor:
                layout === item ? selectedLayoutBackgroundColor : undefined,
            }}
            onPress={() => setLayout(item)}>
            {item}
          </Chip>
        )}
      />
      <CategoriesCollectionSection
        horizontal
        data={volumes}
        renderItem={item => (
          <Chip
            selected={item === currentVolume}
            disabled={chaptersLoading || loading}
            style={{
              backgroundColor:
                item === currentVolume
                  ? selectedVolumeBackgroundColor
                  : undefined,
            }}
            onPress={() => {
              setCurrentVolume(item);
            }}>
            Volume {item}
          </Chip>
        )}
      />

      <View style={{paddingHorizontal: 5}}>
        {chaptersLoading ? (
          <Subheading>Loading chapters</Subheading>
        ) : (
          <Subheading>
            {chaptersCount} chapter{chaptersCount === 1 ? '' : 's'}
          </Subheading>
        )}
      </View>

      {layout === Layout.Grid && (
        <ChaptersGridLayout
          loading={chaptersLoading}
          count={chaptersCount}
          chapters={chapters}
        />
      )}

      {layout === Layout.Images && (
        <ChaptersImagesLayout
          loading={chaptersLoading}
          count={chaptersCount}
          chapters={chapters}
        />
      )}
    </ScrollView>
  );
}