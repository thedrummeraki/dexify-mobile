import React from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import Section from './Section/Section';
import TopManga from './Section/components/TopManga';
import {FeedData} from './types';

interface Props {
  data: FeedData;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function Feed({data, refreshing, onRefresh}: Props) {
  const {
    topManga,
    airingNow,
    popularManga,
    randomManga,
    readingNow,
    recentlyAdded,
  } = data;

  const topMangaMarkup = topManga ? <TopManga manga={topManga} /> : null;
  console.log('readingNow', readingNow);
  const readingNowMarkup = readingNow ? (
    <Section
      section={{
        title: 'Reading now',
        type: 'general',
        slug: 'reading-now',
        manga: readingNow,
      }}
    />
  ) : null;

  const popularMangaMarkup = popularManga ? (
    <Section
      section={{
        title: 'Most popular titles',
        type: 'general',
        slug: 'reading-now',
        manga: popularManga,
      }}
    />
  ) : null;

  const airingNowMarkup = airingNow ? (
    <Section
      section={{
        title: 'Fall 2021 simulcast',
        type: 'general',
        slug: 'reading-now',
        manga: airingNow,
      }}
    />
  ) : null;

  const randomMangaMarkup = randomManga ? (
    <Section
      section={{
        type: 'manga-recommendation',
        slug: 'manga-recommendation-1',
        manga: randomManga,
      }}
    />
  ) : null;

  const recentlyAddedMarkup = recentlyAdded ? (
    <Section
      section={{
        title: 'Newest on Mangadex',
        type: 'general',
        slug: 'reading-now',
        manga: recentlyAdded,
      }}
    />
  ) : null;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {topMangaMarkup}
      {readingNowMarkup}
      {popularMangaMarkup}
      {airingNowMarkup}
      {randomMangaMarkup}
      {recentlyAddedMarkup}
    </ScrollView>
  );
}
