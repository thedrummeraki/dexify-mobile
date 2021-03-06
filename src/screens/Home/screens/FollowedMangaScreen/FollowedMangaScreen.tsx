import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Chip, Searchbar, Text} from 'react-native-paper';
import {
  coverImage,
  findRelationship,
  mangaImage,
  preferredMangaTitle,
} from 'src/api';
import {useLazyGetMangaList} from 'src/api/mangadex/hooks';
import {
  AllReadingStatusResponse,
  ContentRating,
  CoverArt,
  Manga,
  PagedResultsList,
  ReadingStatus,
} from 'src/api/mangadex/types';
import {useGetRequest, useLazyGetRequest} from 'src/api/utils';
import {UIMangaCategory} from 'src/categories';
import {HiddenMangaBanner} from 'src/components';
import BasicList from 'src/components/BasicList';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {useBackgroundColor} from 'src/components/colors';
import MangaThumbnail from 'src/components/MangaThumbnail';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail, {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {
  useContentRatingFitlers,
  useLibraryContext,
  useLibraryMangaIds,
  useUpdatedSession,
} from 'src/prodivers';
import {occurences} from 'src/utils';

export default function FollowedMangaScreen() {
  const contentRating = useContentRatingFitlers();
  const [selectedReadingStatus, setSelectedReadingStatus] =
    useState<ReadingStatus>(ReadingStatus.Reading);

  const [searchInput, setSearchInput] = useState<string>('');
  const [manga, setManga] = useState<Manga[]>([]);
  const [showHiddenMangaBanner, setShowHiddenMangaBanner] = useState(false);

  const possibleReadingStatuses = usePossibleReadingStatuses();
  const selectedChipColor = useBackgroundColor('primary');
  const {readingStatus: data} = useLibraryContext();

  const [getManga, {loading, data: mangaData}] = useLazyGetMangaList();

  const filterManga = useCallback((query: string, manga: Manga[]) => {
    return manga.filter(item => {
      const titles = Object.values(item.attributes.title);
      const altTitles = Object.entries(item.attributes.altTitles).map(
        ([_, title]) => Object.values(title)[0],
      );

      const allTitles = titles
        .concat(altTitles)
        .map(title => title.toLocaleLowerCase());

      return allTitles.filter(title => title.includes(query)).length > 0;
    });
  }, []);

  useEffect(() => {
    const counts = data?.statuses
      ? occurences(Object.values(data.statuses), selectedReadingStatus)
      : null;

    console.log(loading, mangaData?.result, counts, manga.length);

    setShowHiddenMangaBanner(
      !loading &&
        mangaData?.result === 'ok' &&
        counts != null &&
        manga.length > 0 &&
        counts > manga.length,
    );
  }, [mangaData, manga, data, loading, selectedReadingStatus]);

  const currentMangaList = useMemo(
    () =>
      searchInput.trim()
        ? filterManga(searchInput.trim().toLocaleLowerCase(), manga)
        : manga,
    [searchInput, manga],
  );

  useEffect(() => {
    if (data?.statuses) {
      const mangaIds = Object.entries(data.statuses)
        .filter(([_, info]) => info === selectedReadingStatus)
        .map(([mangaId]) => mangaId);

      setManga([]);
      getManga({
        contentRating,
        limit: mangaIds.length,
        ids: mangaIds,
      }).then(response => {
        if (response?.result === 'ok') {
          setManga(response.data);
        }
      });
    }
  }, [data, selectedReadingStatus]);

  useEffect(() => {
    if (searchInput.length === 0) {
      Keyboard.dismiss();
    }
  }, [searchInput]);

  return (
    <View style={{flex: 1, flexDirection: 'column', padding: 5}}>
      <Searchbar
        value={searchInput}
        onChangeText={setSearchInput}
        autoCapitalize="none"
        placeholder="Filter manga..."
        style={{marginTop: 5, marginHorizontal: 5}}
      />
      <CategoriesCollectionSection
        data={Object.entries(possibleReadingStatuses)}
        renderItem={item => {
          const [value, {title}] = item;
          const readingStatus = value as ReadingStatus;
          const selected = readingStatus === selectedReadingStatus;

          const counts = data?.statuses
            ? occurences(Object.values(data.statuses), readingStatus)
            : null;
          const countsMarkup = counts !== null ? ` (${counts})` : null;
          const clickable = counts !== null && counts > 0;
          const onPress = clickable
            ? () => setSelectedReadingStatus(readingStatus)
            : undefined;

          return (
            <Chip
              icon={selected ? 'check' : 'tag'}
              selected={selected}
              disabled={!clickable}
              style={{
                backgroundColor: selected ? selectedChipColor : undefined,
              }}
              onPress={onPress}>
              {title}
              {countsMarkup}
            </Chip>
          );
        }}
        SkeletonItem={<Chip>...</Chip>}
      />

      <ScrollView>
        <BasicList
          loading={loading}
          data={currentMangaList}
          itemStyle={{padding: 5}}
          renderItem={item => <MangaThumbnail key={item.id} manga={item} />}
          HeaderComponent={
            showHiddenMangaBanner ? (
              <View style={{marginTop: 5}}>
                <HiddenMangaBanner />
              </View>
            ) : undefined
          }
          skeletonItem={
            <ThumbnailSkeleton width="100%" aspectRatio={0.8} height="100%" />
          }
          skeletonLength={occurences(
            Object.values(data?.statuses || []),
            selectedReadingStatus,
          )}
        />
      </ScrollView>
    </View>
  );
}

export function usePossibleReadingStatuses() {
  const possibleReadingStatuses: {[key in ReadingStatus]: {title: string}} = {
    [ReadingStatus.Reading]: {title: 'Reading'},
    [ReadingStatus.Completed]: {title: 'Completed'},
    [ReadingStatus.Dropped]: {title: 'Dropped'},
    [ReadingStatus.OnHold]: {title: 'On hold'},
    [ReadingStatus.PlanToRead]: {title: 'Planning'},
    [ReadingStatus.ReReading]: {title: 'Re-reading'},
  };

  return possibleReadingStatuses;
}
