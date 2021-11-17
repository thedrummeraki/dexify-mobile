import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator, Chip, Searchbar, Text} from 'react-native-paper';
import {
  coverImage,
  findRelationship,
  findRelationships,
  mangaImage,
  preferredMangaTitle,
} from 'src/api';
import {
  AllReadingStatusResponse,
  CoverArt,
  Manga,
  PagedResultsList,
  ReadingStatus,
} from 'src/api/mangadex/types';
import { CustomList } from 'src/api/mangadex/types/custom_list';
import {useGetRequest, useLazyGetRequest} from 'src/api/utils';
import {UIMangaCategory} from 'src/categories';
import BasicList from 'src/components/BasicList';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {useBackgroundColor} from 'src/components/colors';
import MangaThumbnail from 'src/components/MangaThumbnail';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail, {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {
  useLibraryContext,
  useLibraryMangaIds,
  useUpdatedSession,
} from 'src/prodivers';
import {occurences} from 'src/utils';
import LibraryDetails from './LibraryDetails';

export default function MyLibraryNavigationScreen() {
  const {session} = useUpdatedSession();
  

  const [get, {data, loading}] = useLazyGetRequest<PagedResultsList<CustomList>>(
    'https://api.mangadex.org/user/list'
  );

  useEffect(() => {
    get();
  }, [session]);

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} />
  }

  if (data?.result === 'ok') {
    const mangaInList = data.data.map(customList => {
      const mangaList = findRelationships<Manga>(customList, 'manga');

      return {
        id: customList.id,
        title: customList.attributes.name,
        mangaCount: mangaList.length,
        mangaId: mangaList[0]?.id,
      }
    })

    return (
      <LibraryDetails mangaInList={mangaInList}/>
    )
  }

  return null;
}
