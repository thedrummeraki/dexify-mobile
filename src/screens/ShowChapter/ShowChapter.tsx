import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {Chapter, EntityResponse} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {useShowChapterRoute} from 'src/foundation/Navigation';
import ShowChapterDetails from './ShowChapterDetails';

export default function ShowChapter() {
  const route = useShowChapterRoute();
  const {data, loading, error} = useGetRequest<EntityResponse<Chapter>>(
    `https://api.mangadex.org/chapter/${route.params.id}`,
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{flex: 1}} />;
  }

  if (error || !data || data.result === 'error') {
    return <Text>Something went wrong while fetching chapter</Text>;
  }

  return <ShowChapterDetails chapter={data.data} />;
}
