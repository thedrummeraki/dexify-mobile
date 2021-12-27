import React, {useState} from 'react';
import {Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native-paper';
import {coverImage, CoverSize} from 'src/api';
import {CoverArt, PagedResultsList} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import BasicList from 'src/components/BasicList';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail from 'src/foundation/Thumbnail';
import {useMangaDetails} from '../ShowMangaDetails';

enum SortRule {
  Asc = -1,
  Desc = 1,
}

export default function GalleryTab() {
  const {manga} = useMangaDetails();

  const navigation = useDexifyNavigation();
  const {data, loading, error} = useGetRequest<PagedResultsList<CoverArt>>(
    `https://api.mangadex.org/cover?manga[]=${manga.id}&limit=100`,
  );
  const [sortRule] = useState(SortRule.Desc);

  if (loading) {
    return <ActivityIndicator size="large" style={{flex: 1}} />;
  }

  if (error || data?.result === 'error') {
    console.error(
      error || (data?.result === 'error' ? data.errors : 'unknown error'),
    );
    return <Text>We couldn't fetch covers for this manga</Text>;
  }

  if (!data) {
    return null;
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
      return (volumeLeftNum > volumeRightNum ? -1 : 1) * sortRule;
    }

    return (volumeLeft > volumeRight ? -1 : 1) * sortRule;
  });

  return (
    <ScrollView>
      <BasicList
        data={sortedCovers}
        aspectRatio={0.5}
        renderItem={(cover, index) => {
          const {volume} = cover.attributes;
          const title =
            !volume || volume === 'null' ? 'N/A' : `Volume ${volume}`;

          return (
            <Thumbnail
              imageUrl={coverImage(cover, manga.id, {size: CoverSize.Small})}
              width="100%"
              aspectRatio={0.7}
              title={title}
              onPress={() =>
                navigation.navigate('ShowMangaGallery', {
                  manga,
                  number: index + 1,
                })
              }
            />
          );
        }}
      />
    </ScrollView>
  );
}
