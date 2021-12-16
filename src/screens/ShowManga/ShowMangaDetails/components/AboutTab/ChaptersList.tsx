import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {Caption, Chip, Text, Title, useTheme} from 'react-native-paper';
import {coverImage, preferredChapterTitle} from 'src/api';
import {Chapter, CoverArt, PagedResultsList} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import BasicList from 'src/components/BasicList';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {useBackgroundColor} from 'src/components/colors';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail from 'src/foundation/Thumbnail';
import {isNumber, pluralize} from 'src/utils';
import {useMangaDetails} from '../../ShowMangaDetails';

type FlatListProps = React.ComponentProps<typeof FlatList>;
type Props = Pick<FlatListProps, 'ListFooterComponent' | 'ListHeaderComponent'>;

export default function ChaptersList({
  ListFooterComponent,
  ListHeaderComponent,
}: Props) {
  const {
    manga,
    volumes,
    loading: aggregateLoading,
    aggregate,
    covers,
    onCoverUrlUpdate,
  } = useMangaDetails();
  const initialized = useRef(false);
  const [showAllVolumes, setShowAllVolumes] = useState(false);
  const [currentVolume, setCurrentVolume] = useState<string>();
  const [chapterIds, setChapterIds] = useState<string[]>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const selectedVolumeBackgroundColor = useBackgroundColor('primary');

  const [getCover] = useLazyGetRequest<PagedResultsList<CoverArt>>();
  const [updateChapters, {data, loading, error}] =
    useLazyGetRequest<PagedResultsList<Chapter>>();

  const volumeSelectorMarkup = currentVolume ? (
    <View>
      <View style={{marginHorizontal: 10}}>
        <CategoriesCollectionSection
          horizontal
          data={volumes}
          focusedIndex={volumes.findIndex(volume => volume === currentVolume)}
          renderItem={item => (
            <Chip
              selected={item === currentVolume}
              disabled={aggregateLoading || loading || chapters.length === 0}
              style={{
                backgroundColor:
                  item === currentVolume
                    ? selectedVolumeBackgroundColor
                    : undefined,
              }}
              onPress={() => {
                setCurrentVolume(item);
                setShowAllVolumes(false);
              }}>
              {item === 'none' ? 'Last volume' : `Volume ${item}`}
            </Chip>
          )}
        />
      </View>
      {/* <Text>wtf</Text> */}
    </View>
  ) : null;

  const flatListHeader = (
    <View style={{marginBottom: 10}}>
      <View style={{marginBottom: 10}}>{ListHeaderComponent}</View>
      {volumeSelectorMarkup}
    </View>
  );

  useEffect(() => {
    if (!currentVolume) {
      // prefer last numbered, then anything else.
      const preferredLastVolume =
        volumes.length === 1
          ? volumes[0]
          : volumes.reverse().find(volume => {
              return isNumber(volume);
            });

      setCurrentVolume(preferredLastVolume || volumes[0]);
    }
  }, [volumes]);

  useEffect(() => {
    if (aggregate && currentVolume) {
      const chaptersInfo = aggregate[currentVolume].chapters;
      if (chaptersInfo) {
        const ids = Object.entries(chaptersInfo).map(([_, value]) => value.id);
        setChapterIds(ids);
      }
    }
  }, [aggregate, currentVolume]);

  useEffect(() => {
    if (currentVolume && covers.length > 0) {
      const lastVolume = covers[0].attributes.volume;
      const cover = covers.find(
        cover =>
          cover.attributes.volume === currentVolume ||
          (currentVolume === 'none' && cover.attributes.volume === lastVolume),
      );
      if (cover) {
        onCoverUrlUpdate(coverImage(cover, manga.id));
      }
    }
  }, [currentVolume, covers]);

  useEffect(() => {
    if (chapterIds?.length) {
      updateChapters(
        UrlBuilder.chaptersList({
          ids: chapterIds,
          limit: chapterIds.length,
          order: {chapter: 'asc'},
          contentRating: [manga.attributes.contentRating],
        }),
      ).then(response => {
        initialized.current = response?.result === 'ok';
      });
    }
  }, [chapterIds]);

  useEffect(() => {
    if (data?.result === 'ok' && data.data) {
      setChapters(data.data);
    }
  }, [data]);

  if (aggregateLoading && !initialized.current) {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={flatListHeader}
        ListEmptyComponent={
          <View style={{marginHorizontal: 15}}>
            <Title>Loading chapters...</Title>
          </View>
        }
        ListFooterComponent={ListFooterComponent}
      />
    );
  }

  if (loading && !initialized.current) {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={flatListHeader}
        ListEmptyComponent={<View />}
        ListFooterComponent={ListFooterComponent}
      />
    );
  }

  if (error || data?.result === 'error') {
    if (error) {
      console.error(error);
    } else if (data?.result === 'error') {
      console.log(JSON.stringify(data.errors));
    }
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={flatListHeader}
        ListEmptyComponent={
          <View style={{marginHorizontal: 15}}>
            <Title>We couldn't fetch the chapters :(</Title>
          </View>
        }
        ListFooterComponent={ListFooterComponent}
      />
    );
  }

  if (chapters.length === 0 && !loading) {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={flatListHeader}
        ListEmptyComponent={
          <View style={{marginHorizontal: 15}}>
            <Title>No chapters were found</Title>
          </View>
        }
        ListFooterComponent={ListFooterComponent}
      />
    );
  }

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={chapters}
      keyExtractor={item => item.id}
      renderItem={({item: chapter}) => <ChapterItem chapter={chapter} />}
      ListHeaderComponent={flatListHeader}
      ListHeaderComponentStyle={{margin: 0}}
      ListFooterComponent={ListFooterComponent}
    />
  );
}

function ChapterItem({chapter}: {chapter: Chapter}) {
  const width = Dimensions.get('window').width - 30;
  const navigation = useDexifyNavigation();
  const theme = useTheme();

  const pagesCount = chapter.attributes.data.length;

  if (pagesCount === 0) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 5,
        }}>
        <View
          style={{paddingVertical: 5, paddingHorizontal: 15, width: '100%'}}>
          <Text numberOfLines={1} style={{width, color: theme.colors.disabled}}>
            {preferredChapterTitle(chapter)}
          </Text>
          <Caption style={{marginTop: 0, color: theme.colors.disabled}}>
            No pages
          </Caption>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
      }}>
      <TouchableNativeFeedback
        useForeground
        onPress={() => navigation.push('ShowChapter', {id: chapter.id})}
        style={{width: '100%'}}>
        <View style={{paddingVertical: 5, paddingHorizontal: 15}}>
          <Text numberOfLines={1} style={{width}}>
            {preferredChapterTitle(chapter)}
          </Text>
          <Caption style={{marginTop: 0}}>
            {pluralize(pagesCount, 'page')}
          </Caption>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}
