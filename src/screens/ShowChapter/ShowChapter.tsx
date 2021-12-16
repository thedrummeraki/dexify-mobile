import React, {useEffect} from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {findRelationship} from 'src/api';
import {Chapter, EntityResponse, Manga} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useGetRequest, useLazyGetRequest} from 'src/api/utils';
import {useShowChapterRoute} from 'src/foundation/Navigation';
import NewShowChapterDetails from './NewShowChapterDetails';
import ShowChapterDetails from './ShowChapterDetails';

export default function ShowChapter() {
  const route = useShowChapterRoute();
  const {data, loading, error} = useGetRequest<EntityResponse<Chapter>>(
    `https://api.mangadex.org/chapter/${route.params.id}?includes[]=manga`,
  );

  const [
    getManga,
    {loading: mangaLoading, data: mangaData, error: mangaError},
  ] = useLazyGetRequest<EntityResponse<Manga>>();

  useEffect(() => {
    if (data?.result === 'ok') {
      getManga(UrlBuilder.mangaById(findRelationship(data.data, 'manga')!.id));
    }
  }, [data]);

  if (loading || mangaLoading) {
    return <ActivityIndicator size="large" style={{flex: 1}} />;
  }

  if (error || !data || data.result === 'error') {
    return <Text>Something went wrong while fetching chapter</Text>;
  }

  if (mangaError || !mangaData || mangaData.result === 'error') {
    return <Text>Something went wrong while fetching the manga.</Text>;
  }

  return (
    <ShowChapterDetails
      chapter={data.data}
      manga={mangaData.data}
      jumpToPage={route.params.jumpToPage}
    />
  );
}
