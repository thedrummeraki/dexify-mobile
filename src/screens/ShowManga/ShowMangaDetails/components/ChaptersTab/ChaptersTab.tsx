import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Subheading, Text} from 'react-native-paper';
import {coverImage} from 'src/api';
import {PagedResultsList, Chapter, CoverArt} from 'src/api/mangadex/types';
import {useLazyGetRequest} from 'src/api/utils';
import {Banner} from 'src/components';
import {useBackgroundColor} from 'src/components/colors';
import {useMangaDetails} from '../../ShowMangaDetails';
import ChaptersGridLayout from './ChaptersGridLayout';
import ChaptersImagesLayout from './ChaptersImagesLayout';

enum Layout {
  Grid = 'Compact',
  Images = 'Images',
}

const layoutIcons: {[key in Layout]: string} = {
  [Layout.Grid]: 'grid',
  [Layout.Images]: 'image',
};

export default function ChaptersTab() {
  const {manga, loading, aggregate, error, coverUrl, onCoverUrlUpdate} =
    useMangaDetails();

  const [showBanner] = useState(false);
  const [layout, setLayout] = useState<Layout>(Layout.Grid);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentVolume, setCurrentVolume] = useState<string>();
  const [covers, setCovers] = useState<CoverArt[]>([]);
  const aggregateEntries = aggregate ? Object.entries(aggregate) : [];

  const volumes = aggregateEntries.map(([volume, _]) => volume);
  const selectedVolumeBackgroundColor = useBackgroundColor('primary');
  const selectedLayoutBackgroundColor = useBackgroundColor('accent');

  const [getChapters, {data, loading: chaptersLoading, error: chaptersError}] =
    useLazyGetRequest<PagedResultsList<Chapter>>();

  const [getCover] = useLazyGetRequest<PagedResultsList<CoverArt>>();

  useEffect(() => {
    setCurrentVolume(volumes[0]);
    getCover(
      `https://api.mangadex.org/cover?manga[]=${manga.id}&limit=100`,
    ).then(result => {
      if (result?.result === 'ok') {
        setCovers(result.data);
      }
    });
  }, []);

  useEffect(() => {
    if (currentVolume) {
      getChapters(
        `https://api.mangadex.org/chapter?limit=100&volume[]=${currentVolume}&manga=${manga.id}&translatedLanguage[]=en&contentRating[]=${manga.attributes.contentRating}`,
      );
      const cover = covers.find(
        cover => cover.attributes.volume === currentVolume,
      );
      if (cover) {
        onCoverUrlUpdate(coverImage(cover, manga.id));
      }
    }
  }, [currentVolume, covers]);

  const chaptersCount = data?.result === 'ok' ? data.total : 0;

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
      <View>
        {Object.entries(manga.attributes.links || {}).length ? (
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
        ) : undefined}
        <Banner
          background="error"
          title="No chapters found"
          body="Looks like no chapters have been uploaded to Mangadex... yet!"
        />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      {/* <ScrollView style={{flex: 1}}> */}
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
      {/* <CategoriesCollectionSection
        horizontal
        data={[Layout.Grid, Layout.Images]}
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
      /> */}
      {/* <CategoriesCollectionSection
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
            {item === 'none' ? 'Last volume' : `Volume ${item}`}
          </Chip>
        )}
      /> */}

      <View style={{marginHorizontal: 10}}>
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
      {/* </ScrollView> */}
    </View>
  );
}
