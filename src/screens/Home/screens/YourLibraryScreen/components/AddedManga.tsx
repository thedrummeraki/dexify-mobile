import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView} from 'react-native';
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
import Thumbnail, {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {pluralize, useDimensions} from 'src/utils';

type GroupedMangaInfo = {
  [key in ReadingStatus]: {ids: string[]; totalCount: number};
};

export default function AddedManga() {
  const [getMangaIds, {data, loading: idsLoading, error}] =
    useLazyGetRequest<AllReadingStatusResponse>(
      UrlBuilder.readingStatusMangaIds(),
    );

  const {width} = useDimensions();

  // making sure we never go over 100 ids across all reading status
  const idCountLimit = 100 / Object.values(ReadingStatus).length;
  const [getManga, {loading: mangaLoading}] =
    useLazyGetRequest<PagedResultsList<Manga>>();

  const loading = mangaLoading || idsLoading;

  const [groupedMangaInfo, setGroupedMangaInfo] = useState<GroupedMangaInfo>();
  const mangaIds = useMemo(
    () =>
      Object.entries(groupedMangaInfo || {})
        .map(([_, value]) => value.ids)
        .flat(),
    [groupedMangaInfo],
  );

  const [manga, setManga] = useState<Manga[]>([]);

  useEffect(() => {
    getMangaIds().then(response => {
      const mappedInfo = Object.entries(response?.statuses || []).map(
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
    });
  }, []);

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

  return (
    <ScrollView
      style={{marginBottom: 80, paddingHorizontal: 5}}
      showsVerticalScrollIndicator={false}>
      <BasicList
        loading={loading}
        data={Object.values(ReadingStatus).map(id => ({id}))}
        aspectRatio={2}
        renderItem={item => {
          const {id: readingStatus} = item;

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
              : 'https://mangadex.org/avatar.png';

          return (
            <Thumbnail
              title={readingStatusInfo(readingStatus).content}
              subtitle={pluralize(info.totalCount, 'title')}
              imageUrl={imageUrl}
              width={width / 2 - 20}
              aspectRatio={1}
              onPress={() => {}}
            />
          );
        }}
        skeletonItem={
          <ThumbnailSkeleton width={width / 2 - 20} height={width / 2 - 20} />
        }
        skeletonLength={2}
        itemStyle={{padding: 5, paddingBottom: 10}}
      />
    </ScrollView>
  );
}
