import React from 'react';
import {ScrollView} from 'react-native';
import {
  LatestChapterUpdates,
  NewTitles,
  PopularTitles,
  RandomManga,
  SeasonalManga,
  TrendingManga,
} from './sections';

export default function MangadexHome() {
  return (
    <ScrollView>
      <TrendingManga />
      <PopularTitles />
      <LatestChapterUpdates />
      <SeasonalManga />
      <RandomManga />
      <NewTitles />
    </ScrollView>
  );
}
