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
  ScanlationGroup,
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

export default function BrowseScanlationGroupResults({query}: Props) {
  const [getGroups, {data, loading}] =
    useLazyGetRequest<PagedResultsList<ScanlationGroup>>();
  const groups = data?.result === 'ok' ? data.data : [];

  useEffect(() => {
    getGroups(UrlBuilder.scanlationGroups({name: query}));
  }, [query]);

  return (
    <List
      loading={loading}
      data={groups.map(group => ({
        title: group.attributes.name,
        image: {url: 'https://mangadex.org/avatar.png', width: 70},
      }))}
    />
  );
}
