import React, {useEffect, useMemo} from 'react';
import {Chip} from 'react-native-paper';
import {
  chapterImage,
  findRelationship,
  findRelationships,
  mangaImage,
  preferredChapterTitle,
  preferredMangaTitle,
} from 'src/api';
import {useGetMangaList, useLazyGetMangaList} from 'src/api/mangadex/hooks';
import {
  Artist,
  Author,
  Chapter,
  Manga,
  PagedResultsList,
} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import {MangaSearchCollection} from 'src/components';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {List} from 'src/components/List/List';
import {useDexifyNavigation} from 'src/foundation';
import {occurences} from 'src/utils';

interface Props {
  query: string;
}

export default function BrowseChapterResults({query}: Props) {
  return null;
}
