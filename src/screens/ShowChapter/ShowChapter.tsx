import React, {useEffect} from 'react';
import {BackHandler, View} from 'react-native';
import {ActivityIndicator, Caption, Text} from 'react-native-paper';
import {findRelationship} from 'src/api';
import {Chapter, EntityResponse, Manga} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useGetRequest, useLazyGetRequest} from 'src/api/utils';
import {
  useDexifyNavigation,
  useShowChapterRoute,
} from 'src/foundation/Navigation';
import NewShowChapterDetails from './NewShowChapterDetails';
import ShowChapterDetails from './ShowChapterDetails';

export default function ShowChapter() {
  const route = useShowChapterRoute();
  const navigation = useDexifyNavigation();
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

  useEffect(() => {
    const unsubscribe = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.pop();
        return true;
      },
    );

    return () => unsubscribe.remove();
  }, []);

  if (loading || mangaLoading) {
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator />
      <Text style={{marginTop: 10}}>Loading chapter...</Text>
      <Caption>...</Caption>
    </View>;
  }

  if (error || data?.result === 'error') {
    return <Text>Something went wrong while fetching chapter</Text>;
  }

  if (mangaError || mangaData?.result === 'error') {
    return <Text>Something went wrong while fetching the manga.</Text>;
  }

  if (!data || !mangaData) {
    return null;
  }

  return (
    <ShowChapterDetails
      chapter={data.data}
      manga={mangaData.data}
      jumpToPage={route.params.jumpToPage}
    />
  );
}
