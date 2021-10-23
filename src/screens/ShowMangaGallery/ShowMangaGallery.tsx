import React from 'react';
import {ActivityIndicator, Text} from 'react-native-paper';
import {coverImage, CoverSize} from 'src/api';
import {CoverArt, PagedResultsList} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {useShowMangaGalleryRoute} from 'src/foundation';
import FullScreenImageSwiper from './FullScreenImageSwiper';

export default function ShowMangaGallery() {
  const route = useShowMangaGalleryRoute();

  const {data, error, loading} = useGetRequest<PagedResultsList<CoverArt>>(
    `https://api.mangadex.org/cover?manga[]=${route.params.id}&limit=100`,
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{flex: 1}} />;
  }

  if (error || !data || data.result === 'error') {
    console.error(error || (data?.result === 'error' && data.errors));
    return <Text>We couldn't fetch covers for this manga</Text>;
  }

  const sortedCovers = data.data.sort((left, right) => {
    const volumeLeft = left.attributes.volume || '';
    const volumeRight = right.attributes.volume || '';
    0;
    const volumeLeftNum = parseFloat(volumeLeft);
    const volumeRightNum = parseFloat(volumeRight);

    if (volumeLeft === volumeRight) {
      return 0;
    }

    if (volumeLeftNum > -1 && volumeRightNum > -1) {
      return volumeLeftNum > volumeRightNum ? -1 : 1;
    }

    return volumeLeft > volumeRight ? -1 : 1;
  });

  return (
    <FullScreenImageSwiper
      initialPage={route.params.number}
      images={sortedCovers.map(cover => ({
        uri: coverImage(cover, route.params.id, {size: CoverSize.Original}),
      }))}
    />
  );
}
