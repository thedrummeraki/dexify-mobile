import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, ScrollView, View} from 'react-native';
import {CoverSize, mangaImage, readingStatusInfo} from 'src/api';
import {
  AllReadingStatusResponse,
  Manga,
  PagedResultsList,
  ReadingStatus,
} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import BasicList from 'src/components/BasicList';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail, {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {useLibraryContext} from 'src/prodivers';
import {pluralize, useDimensions} from 'src/utils';

type GroupedMangaInfo = {
  [key in ReadingStatus]: {ids: string[]; totalCount: number};
};

export default function AddedManga() {
  const navigation = useDexifyNavigation();
  const {readingStatus: data} = useLibraryContext();
  const {width} = useDimensions();

  // making sure we never go over 100 ids across all reading status
  const idCountLimit = 100 / Object.values(ReadingStatus).length;
  const [getManga, {loading: mangaLoading}] =
    useLazyGetRequest<PagedResultsList<Manga>>();

  const [groupedMangaInfo, setGroupedMangaInfo] = useState<GroupedMangaInfo>();
  const [manga, setManga] = useState<Manga[]>([]);

  useEffect(() => {
    const mappedInfo = Object.entries(data?.statuses || []).map(
      ([id, status]) => ({id, status}),
    );

    const grouped = mappedInfo.reduce((storage, item) => {
      const group = item.status;
      storage[group] = storage[group] || {ids: [], totalCount: 0};
      if (storage[group].ids.length < idCountLimit) {
        storage[group].ids.push(item.id);
      }

      storage[group].totalCount = mappedInfo.filter(
        x => x.status === group,
      ).length;

      return storage;
    }, {} as GroupedMangaInfo);

    setGroupedMangaInfo(grouped);
  }, [data]);

  const mangaIds = useMemo(
    () =>
      Object.entries(groupedMangaInfo || {})
        .map(([_, value]) => value.ids)
        .flat(),
    [groupedMangaInfo],
  );
  const loading = mangaLoading && mangaIds.length > 0;

  useEffect(() => {
    if (mangaIds?.length) {
      getManga(
        UrlBuilder.mangaList({ids: mangaIds, limit: mangaIds.length}),
      ).then(response => {
        if (response?.result === 'ok') {
          setManga(response.data);
        }
      });
    }
  }, [mangaIds]);

  if (!groupedMangaInfo) {
    return null;
  }

  if (loading) {
    return (
      <FlatList
        data={Object.values(ReadingStatus)}
        numColumns={2}
        ItemSeparatorComponent={() => <View style={{height: 12}} />}
        contentContainerStyle={{padding: 4}}
        style={{marginBottom: 80}}
        renderItem={({item: readingStatus}) => (
          <ThumbnailSkeleton
            width="100%"
            height="100%"
            padding={4}
            aspectRatio={1}
            title={readingStatusInfo(readingStatus).content}
            subtitle="Loading"
          />
        )}
      />
    );
  }

  return (
    <FlatList
      data={Object.values(ReadingStatus)}
      numColumns={2}
      ItemSeparatorComponent={() => <View style={{height: 12}} />}
      contentContainerStyle={{padding: 4}}
      style={{marginBottom: 80}}
      renderItem={({item: readingStatus}) => {
        const info = groupedMangaInfo[readingStatus] || {
          ids: [],
          totalCount: 0,
        };
        const matchingManga = manga.filter(x => info.ids.includes(x.id));
        const imageUrl =
          matchingManga.length > 0
            ? matchingManga.map(manga =>
                mangaImage(manga, {size: CoverSize.Small}),
              )
            : 'https://mangadex.org/img/avatar.png';

        return (
          <View style={{padding: 4, flex: 1}}>
            <Thumbnail
              title={readingStatusInfo(readingStatus).content}
              subtitle={pluralize(info.totalCount, 'title')}
              imageUrl={imageUrl}
              width="100%"
              aspectRatio={1}
              onPress={() =>
                navigation.push('ShowReadingStatusLibrary', {readingStatus})
              }
            />
          </View>
        );
      }}
    />
  );
}
