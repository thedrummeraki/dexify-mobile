import React, {useEffect} from 'react';
import {PagedResultsList, ScanlationGroup} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import {List} from 'src/components/List/List';
import {useDexifyNavigation} from 'src/foundation';
import BrowseEmptyResults from './BrowseEmptyResults';

interface Props {
  query: string;
}

export default function BrowseScanlationGroupResults({query}: Props) {
  const [getGroups, {data, loading}] =
    useLazyGetRequest<PagedResultsList<ScanlationGroup>>();
  const groups = data?.result === 'ok' ? data.data : [];
  const navigation = useDexifyNavigation();

  useEffect(() => {
    getGroups(UrlBuilder.scanlationGroups({name: query}));
  }, [query]);

  return (
    <List
      style={{padding: 5, paddingTop: 0}}
      loading={loading}
      skeletonLength={15}
      ListEmptyComponent={
        <BrowseEmptyResults resourceType="scanlation group" query={query} />
      }
      data={groups.map(group => ({
        title: group.attributes.name,
        image: {url: 'https://mangadex.org/avatar.png', width: 70},
        onPress: () => navigation.push('ShowScanlationGroup', {id: group.id}),
      }))}
    />
  );
}
