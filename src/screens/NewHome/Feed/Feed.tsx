import React from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import Section from './Section/Section';
import TopManga from './Section/components/TopManga';
import {FeedData} from './types';
import {preferredMangaDescription} from 'src/api';
import {useDexifyNavigation} from 'src/foundation';
import {
  useContinueReadingChaptersList,
  useIsLoggedIn,
  useReadingStateContext,
} from 'src/prodivers';

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
    updates,
  } = data;

  const isLoggedIn = useIsLoggedIn();
  const navigation = useDexifyNavigation();

  const continueReadingChapters = useContinueReadingChaptersList();

  const topMangaMarkup = topManga ? (
    <TopManga
      showReadingStatus
      navigateToManga
      description={preferredMangaDescription(topManga)}
      manga={topManga}
      primaryAction={{
        content: 'Read now',
        onPress: () => navigation.push('ShowManga', topManga),
      }}
    />
  ) : null;

  const continueReadingMarkup =
    continueReadingChapters.length > 0 ? (
      <Section
        section={{
          type: 'continue-reading',
          chapters: continueReadingChapters,
          slug: 'continue-reading',
        }}
      />
    ) : null;

  const updatesMarkup =
    updates && updates.data?.length > 0 ? (
      <Section
        section={{
          type: 'chapters-list',
          chapters: updates.data,
          manga: updates.manga,
          title: 'Latest chapters for you',
        }}
      />
    ) : null;

  const readingNowMarkup = readingNow ? (
    <Section
      section={{
        title: 'Reading now',
        type: 'general',
        manga: readingNow,
      }}
    />
  ) : null;

  const popularMangaMarkup = popularManga ? (
    <Section
      section={{
        title: 'Most popular titles',
        type: 'general',
        manga: popularManga,
      }}
    />
  ) : null;

  const airingNowMarkup = airingNow ? (
    <Section
      section={{
        title: 'Fall 2021 simulcast',
        type: 'general',
        manga: airingNow,
      }}
    />
  ) : null;

  const randomMangaMarkup = randomManga ? (
    <Section
      section={{
        type: 'manga-recommendation',
        manga: randomManga,
      }}
    />
  ) : null;

  const recentlyAddedMarkup = recentlyAdded ? (
    <Section
      section={{
        title: 'Newest on Mangadex',
        type: 'general',
        manga: recentlyAdded,
      }}
    />
  ) : null;

  if (isLoggedIn) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {topMangaMarkup}
        {continueReadingMarkup}
        {readingNowMarkup}
        {updatesMarkup}
        {randomMangaMarkup}
        {airingNowMarkup}
        {recentlyAddedMarkup}
        {popularMangaMarkup}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {topMangaMarkup}
      {continueReadingMarkup}
      {airingNowMarkup}
      {randomMangaMarkup}
      {recentlyAddedMarkup}
      {popularMangaMarkup}
    </ScrollView>
  );
}
