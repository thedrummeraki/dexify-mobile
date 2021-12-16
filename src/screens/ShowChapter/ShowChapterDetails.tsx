import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {Chapter, Manga} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import NewShowChapterDetails from './NewShowChapterDetails';
import ShowChapterPages from './ShowChapterPages';
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
  const {data, loading} = useGetRequest<{baseUrl: string}>(
    `https://api.mangadex.org/at-home/server/${chapter.id}`,
  );

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} size="large" />;
  }

  if (data?.baseUrl) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar hidden />
        {/* <NewShowChapterDetails
          chapter={chapter}
          initialIndex={0}
          pages={chapter.attributes.data.map((_, index) => ({
            number: index + 1,
            originalImageUrl: [
              data.baseUrl,
              'data',
              chapter.attributes.hash,
              chapter.attributes.data[index],
            ].join('/'),
            dataSaverImageUrl: [
              data.baseUrl,
              'data-saver',
              chapter.attributes.hash,
              chapter.attributes.dataSaver[index],
            ].join('/'),
          }))}
        /> */}
        <ShowChapterReader
          baseUrl={data.baseUrl}
          chapter={chapter}
          manga={manga}
          jumpToPage={jumpToPage}
        />
      </SafeAreaView>
    );
  }

  return null;
}
