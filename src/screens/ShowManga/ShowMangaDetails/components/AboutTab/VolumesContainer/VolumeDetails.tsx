import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Button, IconButton, Text} from 'react-native-paper';
import {
  BasicResultsResponse,
  Chapter,
  PagedResultsList,
} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {
  useDeleteRequest,
  useGetRequest,
  useLazyGetRequest,
  usePostRequest,
} from 'src/api/utils';
import {Banner, CloseCurrentScreenHeader} from 'src/components';
import BasicList from 'src/components/BasicList';
import {List} from 'src/components/List/List';
import {useContentRatingFitlers, useIsLoggedIn} from 'src/prodivers';
import {isNumber} from 'src/utils';
import {useMangaDetails, VolumeInfo} from '../../../ShowMangaDetails';
import {ChapterItem} from '../ChaptersList';

interface Props {
  volumeInfo: VolumeInfo;
  onPreviousVolume(): void;
  onNextVolume(): void;
  onCancel(): void;
}

export default function VolumeDetails({volumeInfo, onCancel}: Props) {
  const isLoggedIn = useIsLoggedIn();
  const {volume, chapterIds: ids} = volumeInfo;
  const {manga} = useMangaDetails();
  const readChaptersInitialized = useRef(false);
  const [readChapters, setReadChapters] = useState<string[]>([]);

  const [page, setPage] = useState(1);

  const contentRating = useContentRatingFitlers();
  const [fetchChapters, {data, loading, error}] =
    useLazyGetRequest<PagedResultsList<Chapter>>();
  const hasNextPage =
    data?.result === 'ok' && ids.length > data.offset + data.data.length;
  const hasPrevPage = data?.result === 'ok' && data.offset > 0;

  useEffect(() => {
    const limit = 100;
    const offset = (page - 1) * 100;
    const paginatedIds = ids.slice(offset, page * 100);

    fetchChapters(
      UrlBuilder.chaptersList({
        ids: paginatedIds,
        contentRating,
        order: {
          chapter: 'asc',
          publishAt: 'asc',
        },
        limit,
        offset,
      }),
      {
        refreshSession: false,
        forceRefresh: false,
      },
    );
    if (isLoggedIn) {
      getReadMarkers();
    }
  }, [page, isLoggedIn]);

  const [getReadMarkers, {data: readMarkersData, loading: readMarkersLoading}] =
    useLazyGetRequest<{
      result: 'ok';
      data: string[];
    }>(UrlBuilder.mangaReadMarkers(manga.id));

  const [markRead] = usePostRequest<BasicResultsResponse>();
  const [markUnread] = useDeleteRequest<BasicResultsResponse>();

  const markAsRead = useCallback(
    (chapter: {id: string}) => {
      return markRead(UrlBuilder.markChapterAsRead(chapter));
    },
    [markRead],
  );

  const markAsUnread = useCallback(
    (chapter: {id: string}) => {
      return markUnread(UrlBuilder.unmarkChapterAsRead(chapter));
    },
    [markUnread],
  );

  useEffect(() => {
    if (readMarkersData?.result === 'ok' && !readChaptersInitialized.current) {
      setReadChapters(readMarkersData.data);
      readChaptersInitialized.current = true;
    }
  }, [readMarkersData]);

  const title =
    volume === 'null' || volume === null ? 'No volume' : `Volume ${volume}`;

  if (loading || readMarkersLoading) {
    return (
      <View>
        <CloseCurrentScreenHeader
          onClose={onCancel}
          title={title}
          icon="arrow-left"
        />
        <ActivityIndicator style={{flex: 1}} />
        {/* <BasicList
          loading
          data={[]}
          aspectRatio={1}
          skeletonItem={<List.Item.Skeleton />}
          skeletonLength={ids.length}
          itemStyle={{padding: 0}}
        /> */}
      </View>
    );
  }

  if (error || data?.result === 'error') {
    console.error(
      error || (data?.result === 'error' && data.errors) || 'unknown error',
    );
    return (
      <Banner
        background="error"
        title="Woops!"
        body="Something went wrong when fetch the chapters."
      />
    );
  }

  if (data) {
    return (
      <View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <CloseCurrentScreenHeader
            onClose={onCancel}
            title={title}
            icon="arrow-left"
          />
          <IconButton icon="dots-vertical" onPress={() => {}} />
        </View>
        <BasicList
          data={data.data}
          aspectRatio={1}
          renderItem={chapter => {
            const markedAsRead = readChapters.includes(chapter.id);

            return (
              <ChapterItem
                chapter={chapter}
                markedAsRead={markedAsRead}
                onPress={() => {
                  // we're marking as read here, the API call is when the chapter
                  // is actually opened.
                  setReadChapters(current => [...current, chapter.id]);
                }}
                onLongPress={() => {
                  if (markedAsRead) {
                    setReadChapters(current =>
                      current.filter(x => !x.includes(chapter.id)),
                    );
                    markAsUnread(chapter);
                  } else {
                    setReadChapters(current => [...current, chapter.id]);
                    markAsRead(chapter);
                  }
                }}
              />
            );
          }}
          itemStyle={{padding: 0}}
        />
        <View style={{flexDirection: 'row', display: 'none'}}>
          <Button
            disabled={!hasPrevPage}
            style={{flex: 1, margin: 5}}
            onPress={() => setPage(page => page - 1)}>
            Previous
          </Button>
          <Button
            disabled={!hasNextPage}
            style={{flex: 1, margin: 5}}
            onPress={() => setPage(page => page + 1)}>
            Next
          </Button>
        </View>
      </View>
    );
  }

  return null;
}
