import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {ActivityIndicator, Caption, Text} from 'react-native-paper';
import {
  AtHomeResponse,
  BasicResultsResponse,
  Chapter,
  Manga,
} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useGetRequest, usePostRequest} from 'src/api/utils';
import ShowChapterReader from './ShowChapterReader';

interface Props {
  chapter: Chapter;
  manga: Manga;
  jumpToPage?: number;
}

export default function ShowChapterDetails({
  chapter,
  manga,
  jumpToPage,
}: Props) {
  const {data, loading} = useGetRequest<AtHomeResponse>(
    `https://api.mangadex.org/at-home/server/${chapter.id}`,
  );

  const [markRead] = usePostRequest<BasicResultsResponse>();

  useEffect(() => {
    markRead(UrlBuilder.markChapterAsRead(manga), {
      chapterIdsRead: [chapter.id],
    });
  }, []);

  if (loading) {
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator />
      <Text style={{marginTop: 10}}>Loading pages...</Text>
      <Caption>...</Caption>
    </View>;
  }

  if (data?.result === 'error') {
    return null;
  }

  if (data?.baseUrl) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar hidden />
        <ShowChapterReader
          response={data}
          chapter={chapter}
          manga={manga}
          jumpToPage={jumpToPage}
        />
      </SafeAreaView>
    );
  }

  return null;
}
