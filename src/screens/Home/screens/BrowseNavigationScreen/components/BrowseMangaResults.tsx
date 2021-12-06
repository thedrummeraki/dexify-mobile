import React, {useEffect, useMemo} from 'react';
import {View} from 'react-native';
import {Chip, Paragraph, Title} from 'react-native-paper';
import {
  findRelationship,
  findRelationships,
  mangaImage,
  preferredMangaTitle,
} from 'src/api';
import {useGetMangaList, useLazyGetMangaList} from 'src/api/mangadex/hooks';
import {Artist, Author} from 'src/api/mangadex/types';
import {MangaSearchCollection} from 'src/components';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {List} from 'src/components/List/List';
import {useDexifyNavigation} from 'src/foundation';
import {occurences} from 'src/utils';
import BrowseEmptyResults from './BrowseEmptyResults';

interface Props {
  query: string;
}

export default function BrowseMangaResults({query}: Props) {
  const navigation = useDexifyNavigation();
  const [searchManga, {data, loading}] = useLazyGetMangaList({
    limit: 20,
    order: {relevance: 'desc'},
  });
  const manga = data?.result === 'ok' ? data.data : [];

  useEffect(() => {
    searchManga({title: query});
  }, [query]);

  return (
    <List
      style={{padding: 5}}
      loading={loading}
      ListEmptyComponent={
        <BrowseEmptyResults
          resourceType="manga"
          actionVerb="was"
          query={query}
        />
      }
      data={manga.map(manga => {
        const by =
          findRelationship<Author>(manga, 'author') ||
          findRelationship<Artist>(manga, 'artist');

        return {
          title: preferredMangaTitle(manga),
          subtitle: [manga.attributes.status, by?.attributes.name]
            .filter(x => x)
            .join(' - '),
          image: {width: 70, url: mangaImage(manga)},
          onPress: () => navigation.push('ShowManga', manga),
        };
      })}
    />
  );
}
