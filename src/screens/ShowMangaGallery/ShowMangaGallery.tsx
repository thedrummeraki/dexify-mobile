import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Image, View} from 'react-native';
import {ActivityIndicator, Caption, Text} from 'react-native-paper';
import {coverImage, CoverSize, preferredMangaTitle} from 'src/api';
import {CoverArt, PagedResultsList} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {useShowMangaGalleryRoute} from 'src/foundation';
import {pluralize, useDimensions} from 'src/utils';
import ReaderProvider from '../ShowChapter/ShowChapterReader/components/ReaderProvider';
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

  const totalPageCount = data?.result === 'ok' ? data.data.length : 0;

  const progress = useMemo(() => {
    if (totalPageCount <= 0) {
      return 0;
    }
    return pages.length / totalPageCount;
  }, [pages, totalPageCount]);

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
        <ActivityIndicator />
        <Text style={{marginTop: 10}}>
          {coversLoading ? 'Loading...' : 'Opening gallery...'}
        </Text>
        <Caption>{Math.floor(progress * 100)}%</Caption>
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
    <ReaderProvider
      manga={manga}
      title={preferredMangaTitle(manga)}
      subtitle={pluralize(sortedPages.length, 'cover')}
      initialPage={1}
      pages={sortedPages}>
      <ShowChapterReaderPagesList pages={sortedPages} initialIndex={0} />
    </ReaderProvider>
  );
}
