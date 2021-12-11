import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {Chapter} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import NewShowChapterDetails from './NewShowChapterDetails';
import ShowChapterPages from './ShowChapterPages';

interface Props {
  chapter: Chapter;
}

export default function ShowChapterDetails({chapter}: Props) {
  const {data, loading} = useGetRequest<{baseUrl: string}>(
    `https://api.mangadex.org/at-home/server/${chapter.id}`,
  );

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} size="large" />;
  }

  if (data?.baseUrl) {
    return (
      <NewShowChapterDetails
        chapter={chapter}
        initialIndex={1}
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
      />
    );
  }

  return null;
}
