import React, {useEffect} from 'react';
import {findRelationships} from 'src/api';
import {Author, PagedResultsList} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import {List} from 'src/components/List/List';
import {useDexifyNavigation} from 'src/foundation';
import {pluralize} from 'src/utils';
import BrowseEmptyResults from './BrowseEmptyResults';

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
      style={{padding: 5, paddingTop: 0}}
      loading={loading}
      skeletonLength={15}
      skeletonBorderRadius={1000}
      ListEmptyComponent={
        <BrowseEmptyResults resourceType="author" query={query} />
      }
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
            width: 70,
            rounded: true,
          },
          onPress: () => navigation.push('ShowArtist', {id: author.id}),
        };
      })}
    />
  );
}
