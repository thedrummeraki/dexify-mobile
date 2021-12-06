import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {findRelationships} from 'src/api';
import {
  ContentRating,
  CustomList,
  Manga,
  PagedResultsList,
} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useGetRequest, useLazyGetRequest} from 'src/api/utils';
import {useLibraryContext} from 'src/prodivers';
import LibraryDetails from './LibraryDetails';

interface CustomListInfo {
  customList: CustomList;
  manga: Manga[];
}

export default function MyLibraryNavigationScreen() {
  const initialized = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [customListInfo, setCustomListInfo] = useState<CustomListInfo[]>();
  const [getCustomLists, {loading, data}] = useLazyGetRequest<
    PagedResultsList<CustomList>
  >(UrlBuilder.currentUserCustomLists({limit: 100}));
  const [getManga] = useLazyGetRequest<PagedResultsList<Manga>>();

  const onRefresh = () => {
    setRefreshing(true);
    getCustomLists()
      .then(console.log)
      .then(() => console.log('[INFO] custom list list updated'))
      .catch(console.error)
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    getCustomLists();
  }, []);

  useEffect(() => {
    if (data?.result === 'ok') {
      getManga(mangaListUrlsFrom(data.data))
        .then(response => {
          if (response?.result === 'ok') {
            const result: CustomListInfo[] = [];
            for (const customList of data.data) {
              const customListMangaIds = findRelationships(
                customList,
                'manga',
              ).map(r => r.id);
              const manga = response.data.filter(m =>
                customListMangaIds.includes(m.id),
              );
              result.push({customList, manga});
            }
            setCustomListInfo(result);
          }
        })
        .catch(console.error);
    }
  }, [data]);

  useEffect(() => {
    if (!initialized.current && !loading) {
      initialized.current = true;
    }
  }, [loading]);

  if (loading && !initialized) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (customListInfo) {
    const mangaInList = customListInfo.map(info => {
      const {customList, manga} = info;
      return {
        id: customList.id,
        title: customList.attributes.name,
        visibility: customList.attributes.visibility,
        mangaCount: manga.length,
        manga,
      };
    });

    return (
      <LibraryDetails
        mangaInList={mangaInList}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    );
  }

  return null;
}

function mangaListUrlsFrom(customLists: CustomList[]) {
  const mangasIds: string[] = [];
  for (const customList of customLists) {
    for (const id of findRelationships(customList, 'manga').map(r => r.id)) {
      if (!mangasIds.includes(id)) {
        mangasIds.push(id);
      }
    }
  }

  return UrlBuilder.mangaList({
    ids: mangasIds,
    limit: mangasIds.length,
    contentRating: Object.values(ContentRating),
  });
}
