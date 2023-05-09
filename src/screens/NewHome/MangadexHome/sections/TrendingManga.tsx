import React from 'react';
import {preferredMangaDescription} from 'src/api';
import {useDexifyNavigation} from 'src/foundation';
import TopManga from '../components/TopManga';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {usePopularManga} from '../hooks';

export default function TrendingManga() {
  const navigation = useDexifyNavigation();
  const {data, loading} = usePopularManga({limit: 1});

  if (loading) {
    return (
      <SkeletonContent
        isLoading
        animationDirection="horizontalRight"
        boneColor="#222"
        highlightColor="#333333"
        containerStyle={{width: '100%', aspectRatio: 0.75, flex: 1}}
        layout={[{key: 'top-manga', width: '100%', aspectRatio: 0.75}]}
      />
    );
  }

  if (data?.result === 'ok') {
    const topManga = data.total > 0 ? data.data[0] : null;

    if (topManga) {
      return (
        <TopManga
          showReadingStatus
          manga={topManga}
          navigateToManga
          description={preferredMangaDescription(topManga)}
          aspectRatio={0.75}
          primaryAction={{
            content: 'Read now',
            onPress: () => navigation.push('ShowManga', topManga),
          }}
        />
      );
    }
  }

  return null;
}
