import React, {useEffect} from 'react';
import {findRelationship, mangaImage, preferredMangaTitle} from 'src/api';
import {useLazyGetMangaList} from 'src/api/mangadex/hooks';
import {Artist, Author} from 'src/api/mangadex/types';
import {ResponseStatus} from 'src/api/utils';
import {List} from 'src/components/List/List';
import {useDexifyNavigation} from 'src/foundation';
import {useSettings} from 'src/prodivers';
import BrowseEmptyResults from './BrowseEmptyResults';

interface Props {
  query: string;
}

export default function BrowseMangaResults({query}: Props) {
  const navigation = useDexifyNavigation();
  const [searchManga, {data, status}] = useLazyGetMangaList({
    limit: 100,
    order: {relevance: 'desc'},
  });
  const manga = data?.result === 'ok' ? data.data : [];
  const {contentRatings, mangaLanguages} = useSettings();

  useEffect(() => {
    searchManga({
      title: query,
      contentRating: contentRatings,
      availableTranslatedLanguage: mangaLanguages,
    });
  }, [query]);

  return (
    <List
      style={{padding: 5, paddingTop: 0}}
      loading={
        status === ResponseStatus.Initiated || status === ResponseStatus.Pending
      }
      skeletonLength={15}
      ListEmptyComponent={
        <BrowseEmptyResults
          resourceType="manga"
          resourceTypePlural="manga"
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
