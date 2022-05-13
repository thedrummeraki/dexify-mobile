import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {Manga, PagedResultsList} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useGetRequest} from 'src/api/utils';
import {Banner, CloseCurrentScreenHeader} from 'src/components';
import MangaCollection from 'src/components/MangaCollection';
import {useShowMangaListRoute} from 'src/foundation';
import {useGlobalMangaParams} from 'src/prodivers';

export default function ShowMangaList() {
  const {
    params: {title, description},
  } = useShowMangaListRoute();
  const url = useMangaListUrl();
  const {data, loading, error} = useGetRequest<PagedResultsList<Manga>>(url);

  return (
    <View>
      <CloseCurrentScreenHeader title={title} />
      <ShowMangaListDetails
        description={description}
        data={data}
        loading={loading}
        error={error}
      />
    </View>
  );
}

function ShowMangaListDetails({
  description,
  data,
  loading,
  error,
}: {
  description?: string;
  data?: PagedResultsList<Manga>;
  loading: boolean;
  error: any;
}) {
  const [manga, setManga] = useState<Manga[]>([]);

  useEffect(() => {
    if (data?.result === 'ok') {
      setManga(data.data);
    }
  }, [data]);

  if (data?.result === 'error' || error) {
    return (
      <Banner
        title="Uh oh!"
        body="We were unable to fetch this list of manga. Please try again later."
      />
    );
  }

  return (
    <MangaCollection
      loading={loading}
      showReadingStatus
      manga={manga}
      description={description}
    />
  );
}

function useMangaListUrl() {
  const defaultParams = useGlobalMangaParams();
  const {
    params: {params, ids},
  } = useShowMangaListRoute();

  if (!ids) {
    return UrlBuilder.mangaList({...defaultParams, ...params});
  }

  return UrlBuilder.mangaListForCategory({
    type: 'manga',
    ids,
    params,
  });
}
