import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Image, View} from 'react-native';
import {ActivityIndicator, Caption, Text} from 'react-native-paper';
import {mangaImage, preferredChapterTitle, preferredMangaTitle} from 'src/api';
import {AtHomeSuccessResponse, Chapter, Manga} from 'src/api/mangadex/types';
import {useMangadexSettings, useReadingStateContext} from 'src/prodivers';
import {useDimensions} from 'src/utils';
import ReaderProvider from './components/ReaderProvider';
import ShowChapterReaderPagesList from './components/ShowChapterReaderPagesList';
import {Page} from './types';

interface Props {
  response: AtHomeSuccessResponse;
  chapter: Chapter;
  manga: Manga;
  jumpToPage?: number;
}

export default function ShowChapterReader({
  response,
  chapter,
  manga,
  jumpToPage,
}: Props) {
  const initialized = useRef(false);
  const {
    baseUrl,
    chapter: {data, dataSaver, hash},
  } = response;
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<Page[]>([]);
  const {width: deviceWidth, height: deviceHeight} = useDimensions();
  const {
    userPreferences: {dataSaver: isDataSaver},
  } = useMangadexSettings();
  const {updateChapter} = useReadingStateContext();
  const totalPageCount = data.length;
  const initialIndex =
    jumpToPage === undefined
      ? 0
      : jumpToPage < 1 || jumpToPage > totalPageCount
      ? 0
      : jumpToPage - 1;

  const progress = useMemo(() => {
    if (totalPageCount <= 0) {
      return 0;
    }
    return pages.length / totalPageCount;
  }, [pages, totalPageCount]);

  const handleOnPageNumberChange = useCallback(
    (page: number) => {
      updateChapter({
        chapter,
        coverUrl: mangaImage(manga),
        imageUrl: 'https://mangadex.org/img/avatar.png',
        mangaId: manga.id,
        mangaName: preferredMangaTitle(manga),
        page,
        totalPageCount,
      });
    },
    [chapter, manga, totalPageCount, updateChapter],
  );

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    const dataSource = isDataSaver ? dataSaver : data;
    const source = isDataSaver ? 'data-saver' : 'data';

    dataSource.forEach((filename, index) => {
      const number = index + 1;
      const uri = [baseUrl, source, hash, filename].join('/');

      Image.getSize(
        uri,
        (width, height) => {
          const page: Page = {
            number,
            image: {uri, width, height},
            position: number,
          };
          setPages(current => [...current, page]);
        },
        () => {
          const page: Page = {
            number,
            image: {uri, width: deviceWidth, height: deviceHeight},
            position: number,
          };
          setPages(current => [...current, page]);
        },
      );
    });
  }, [baseUrl, isDataSaver, dataSaver, data, hash, deviceHeight, deviceWidth]);

  useEffect(() => {
    const loading = pages.length < data.length;
    if (!loading) {
      initialized.current = true;
    }
    setLoading(pages.length < data.length);
  }, [pages]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
        <Text style={{marginTop: 10}}>Opening chapter...</Text>
        <Caption>{Math.floor(progress * 100)}%</Caption>
      </View>
    );
  }

  const sortedPages = pages.sort((page, other) =>
    page.number > other.number ? 1 : -1,
  );

  return (
    <View style={{flex: 1}}>
      <ReaderProvider
        manga={manga}
        chapter={chapter}
        title={preferredChapterTitle(chapter)}
        subtitle={preferredMangaTitle(manga)}
        pages={sortedPages}
        group={chapter.attributes.volume}
        locale={chapter.attributes.translatedLanguage}
        initialPage={initialIndex + 1}>
        <ShowChapterReaderPagesList
          pages={sortedPages}
          initialIndex={initialIndex}
          onPageNumberChange={handleOnPageNumberChange}
        />
      </ReaderProvider>
    </View>
  );
}
