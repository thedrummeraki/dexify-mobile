import React, {useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import {readingStatusInfo} from 'src/api';
import {AllReadingStatusResponse, ReadingStatus} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import MangaCategoryItem from 'src/components/CategoriesCollection/MangaCategoryItem';

export default function AddedManga() {
  const [getMangaIds, {data, loading, error}] =
    useLazyGetRequest<AllReadingStatusResponse>(
      UrlBuilder.readingStatusMangaIds(),
    );

  useEffect(() => {
    getMangaIds();
  }, []);

  if (data?.statuses) {
    const statusEntries = Object.entries(data.statuses);
    return (
      <ScrollView>
        {Object.values(ReadingStatus).map(readingStatus => {
          const ids = statusEntries
            .filter(([mangaId, mangaReadingStatus]) => {
              return mangaReadingStatus === readingStatus;
            })
            .map(([mangaId]) => mangaId);

          if (ids.length === 0) {
            return null;
          }

          const info = readingStatusInfo(readingStatus);

          return (
            <MangaCategoryItem
              key={readingStatus}
              showReadingStatus={false}
              category={{
                ids,
                type: 'manga',
                title: info.content,
                description: info.phrase,
              }}
            />
          );
        })}
      </ScrollView>
    );
  }

  return null;
}
