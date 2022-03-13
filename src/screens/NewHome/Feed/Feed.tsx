import React, {useEffect} from 'react';
import {RefreshControl, ScrollView, StatusBar} from 'react-native';
import Section from './Section/Section';
import TopManga from './Section/components/TopManga';
import {FeedData} from './types';
import {preferredMangaDescription} from 'src/api';
import {useDexifyNavigation} from 'src/foundation';
import {useContinueReadingChaptersList, useIsLoggedIn} from 'src/prodivers';
import {EmptySectionState} from './Section/components';
import {Banner} from 'src/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {currentSeason} from 'src/utils';
import {ReadingStatus} from 'src/api/mangadex/types';

interface Props {
  data: FeedData;
  refreshing: boolean;
  onRefresh: () => void;
  onFocus: () => void;
}

export default function Feed({data, refreshing, onRefresh, onFocus}: Props) {
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

  // useEffect(() => {
  //   const remove = navigation.addListener('focus', () => {
  //     console.log('on focus');
  //     onFocus();
  //   });

  //   return remove;
  // }, []);

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
    ) : isLoggedIn ? (
      <EmptySectionState title="Latest chapters for you">
        <Banner
          background="surface"
          title="Follow some manga titles!"
          primaryAction={{content: 'Refresh', onAction: onRefresh}}>
          Follw any manga by pressing on "<Icon name="rss" />" when viewing a
          title. Stay tuned and view the latest chapters for the titles you're
          currently following.
        </Banner>
      </EmptySectionState>
    ) : null;

  const readingNowMarkup = readingNow ? (
    <Section
      section={{
        title: 'Reading now',
        type: 'general',
        manga: readingNow,
        viewMore: () =>
          navigation.push('ShowReadingStatusLibrary', {
            readingStatus: ReadingStatus.Reading,
          }),
      }}
    />
  ) : null;

  const popularMangaMarkup = popularManga ? (
    <Section
      section={{
        title: 'Most popular titles',
        type: 'general',
        manga: popularManga,
        viewMore: () =>
          navigation.push('ShowMangaList', {
            title: 'Most popular titles',
            params: {order: {followedCount: 'desc'}, limit: 100},
          }),
      }}
    />
  ) : null;

  const airingNowMarkup = airingNow ? (
    <Section
      section={{
        title: `${currentSeason({capitalize: true})} anime simulcast`,
        type: 'general',
        manga: airingNow,
        viewMore: () => {
          navigation.push('ShowAnimeSimulcastMangaList');
        },
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
        viewMore: () =>
          navigation.push('ShowMangaList', {
            title: 'Newest on Mangadex',
            params: {order: {createdAt: 'desc'}, limit: 100},
          }),
      }}
    />
  ) : null;

  if (isLoggedIn) {
    return (
      <>
        {/* <LinearGradient
          colors={['#79e3fe', '#635df8', '#42385D']}
          style={{flex: 1}}>
          <StatusBar />
        </LinearGradient> */}

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {topMangaMarkup}
          {continueReadingMarkup}
          {readingNowMarkup}
          {updatesMarkup}
          {/* {randomMangaMarkup} */}
          {airingNowMarkup}
          {recentlyAddedMarkup}
          {popularMangaMarkup}
        </ScrollView>
      </>
    );
  }

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {topMangaMarkup}
        {continueReadingMarkup}
        {airingNowMarkup}
        {/* {randomMangaMarkup} */}
        {recentlyAddedMarkup}
        {popularMangaMarkup}
      </ScrollView>
    </>
  );
}
