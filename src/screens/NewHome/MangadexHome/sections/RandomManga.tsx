import React from 'react';
import {Text} from 'react-native-paper';
import {MangaRecommendationSection} from '../components';
import {useRandomManga} from '../hooks';

export default function RandomManga() {
  const {data, loading} = useRandomManga();

  if (loading) {
    return <Text>loading...</Text>;
  }

  if (data?.result === 'ok') {
    return (
      <MangaRecommendationSection
        section={{manga: data.data, type: 'manga-recommendation'}}
      />
    );
  }

  return null;
}
