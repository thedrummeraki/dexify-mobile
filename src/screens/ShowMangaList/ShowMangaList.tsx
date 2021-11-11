import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {Manga, PagedResultsList} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {Banner} from 'src/components';
import MangaCollection from 'src/components/MangaCollection';
import {useShowMangaListRoute} from 'src/foundation';

export default function ShowMangaList() {
  const {
    params: {title, description},
  } = useShowMangaListRoute();
  const url = useMangaListUrl();
  const {data, loading, error} = useGetRequest<PagedResultsList<Manga>>(url);

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (data?.result === 'error' || error) {
    return (
      <Banner
        title="Uh oh!"
        body="We were unable to fetch this list of manga. Please try again later."
      />
    );
  }

  if (data?.result === 'ok')
    return (
      <MangaCollection
        showReadingStatus
        manga={data.data}
        title={title}
        description={description}
      />
    );

  return null;
}

function useMangaListUrl() {
  const {
    params: {params, ids},
  } = useShowMangaListRoute();

  let url = 'https://api.mangadex.org/manga';

  const idParams = ids ? ids.map(id => `ids[]=${id}`).join('&') : '';
  const additionalParams = params ? new URLSearchParams(params).toString() : '';

  const finalParams = [idParams, `limit=${ids?.length || 10}`, additionalParams]
    .filter(params => Boolean(params))
    .join('&');

  if (finalParams.length) {
    url = url.concat('?', finalParams);
  }

  return url;
}
