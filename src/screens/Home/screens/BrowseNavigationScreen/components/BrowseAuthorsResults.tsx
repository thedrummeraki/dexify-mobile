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
import {occurences, pluralize} from 'src/utils';

interface Props {
  query: string;
}

export default function BrowseAuthorsGroupResults({query}: Props) {
  const navigation = useDexifyNavigation();
  const [getAuthors, {data, loading}] =
    useLazyGetRequest<PagedResultsList<Author>>();
  const authors = data?.result === 'ok' ? data.data : [];

  useEffect(() => {
    getAuthors(UrlBuilder.authors({name: query}));
  }, [query]);

  return (
    <List
      loading={loading}
      data={authors.map(author => {
        const works = findRelationships(author, 'manga');
        const subtitle =
          works.length > 9
            ? '9+ works'
            : works.length
            ? pluralize(works.length, 'work')
            : '';

        return {
          title: author.attributes.name,
          subtitle,
          image: {
            url:
              author.attributes.imageUrl || 'https://mangadex.org/avatar.png',
            width: 60,
            rounded: true,
          },
          onPress: () => navigation.push('ShowArtist', {id: author.id}),
        };
      })}
    />
  );
}
