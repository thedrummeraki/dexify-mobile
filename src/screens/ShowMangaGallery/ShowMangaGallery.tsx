import React, {useEffect, useRef, useState} from 'react';
import {Image, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {coverImage, CoverSize} from 'src/api';
import {CoverArt, PagedResultsList} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {useShowMangaGalleryRoute} from 'src/foundation';
import {useDimensions} from 'src/utils';
import ShowChapterReaderPagesList from '../ShowChapter/ShowChapterReader/components/ShowChapterReaderPagesList';
import {Page} from '../ShowChapter/ShowChapterReader/types';

export default function ShowMangaGallery() {
  const initialized = useRef(false);
  const route = useShowMangaGalleryRoute();
  const {width: deviceWidth, height: deviceHeight} = useDimensions();
  const [pages, setPages] = useState<Page[]>([]);
  const [dimensionsLoading, setDimensionsLoading] = useState(true);

  // const coverWidth = deviceWidth / 2 -10;
  // const coverHeight = coverWidth * 160 / 120;

  const {
    params: {manga},
  } = route;

  const {
    data,
    error,
    loading: coversLoading,
  } = useGetRequest<PagedResultsList<CoverArt>>(
    `https://api.mangadex.org/cover?manga[]=${manga.id}&limit=100`,
  );

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    if (data?.result === 'ok') {
      data.data.forEach((cover, index) => {
        const number = cover.attributes.volume
          ? parseInt(cover.attributes.volume)
          : index + 1;
        const uri = coverImage(cover, manga.id, {size: CoverSize.Original});
        Image.getSize(
          uri,
          (width, height) => {
            const page: Page = {
              number,
              image: {uri, width, height},
            };
            setPages(current => [...current, page]);
          },
          () => {
            const page: Page = {
              number,
              image: {uri, width: deviceWidth, height: deviceHeight},
            };
            setPages(current => [...current, page]);
          },
        );
      });
    }
  }, [data]);

  useEffect(() => {
    const loading = data?.result !== 'ok' || pages.length < data.data.length;
    if (!loading) {
      initialized.current = true;
    }
    setDimensionsLoading(
      data?.result !== 'ok' || pages.length < data.data.length,
    );
  }, [pages, data]);

  const loading = coversLoading || dimensionsLoading;

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        <Text style={{textAlign: 'center'}}>
          {coversLoading ? 'Loading...' : 'Opening gallery...'}
        </Text>
      </View>
    );
  }

  if (error || data?.result === 'error') {
    if (error) {
      console.error(error);
    } else if (data?.result === 'error') {
      console.log(JSON.stringify(data.errors));
    }
    return <Text>We couldn't fetch covers for this manga</Text>;
  }

  const sortedPages = pages.sort((page, other) =>
    page.number > other.number ? 1 : -1,
  );

  console.log({sortedPages});

  return (
    // <FullScreenImageSwiper
    //   initialPage={route.params.number}
    //   images={sortedCovers.map(cover => ({
    //     uri: coverImage(cover, route.params.id, {size: CoverSize.Original}),
    //   }))}
    //   onPageSelected={() => {}}
    // />
    <>
      {/* <CloseCurrentScreenHeader title={preferredMangaTitle(manga)} /> */}
      {/* <ScrollView>
      <BasicList
        data={sortedCovers}
        aspectRatio={0.5}
        itemStyle={{padding: 5}}
        renderItem={cover => <Thumbnail imageUrl={coverImage(cover, manga.id)} width={coverWidth} height={coverHeight} />} />
    </ScrollView> */}
      <ShowChapterReaderPagesList pages={sortedPages} initialIndex={0} />
    </>
  );
}
