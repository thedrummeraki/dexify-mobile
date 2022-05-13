import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Button, IconButton} from 'react-native-paper';
import {
  BasicResultsResponse,
  Chapter,
  PagedResultsList,
} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {
  requestStarted,
  useDeleteRequest,
  useLazyGetRequest,
  usePostRequest,
} from 'src/api/utils';
import {Banner, CloseCurrentScreenHeader} from 'src/components';
import BasicList from 'src/components/BasicList';
import {useBackgroundColor} from 'src/components/colors';
import {useSettingsContext} from 'src/prodivers';
import {useMangaDetails, VolumeInfo} from '../../../ShowMangaDetails';
import {ChapterItem} from '../ChaptersList';
import LocaleSelectionModal from './LocaleSelectionModal';

enum SortRule {
  Asc = -1,
  Desc = 1,
}

interface Props {
  volumeInfo: VolumeInfo;
  onPreviousVolume(): void;
  onNextVolume(): void;
  onCancel(): void;
}

export default function VolumeDetails({volumeInfo, onCancel}: Props) {
  const {volume, chapterIds: ids} = volumeInfo;
  const {manga, preferredLanguages, onPreferredLanguagesChange} =
    useMangaDetails();
  const readChaptersInitialized = useRef(false);
  const {settings, updateSetting} = useSettingsContext();
  const [sortRule, setSortOrder] = useState<SortRule>(
    settings.chaptersSortOrder === 'desc' ? SortRule.Desc : SortRule.Asc,
  );
  const [sortButtonDisabled, setSortButtonDisabled] = useState(false);

  const [readChapters, setReadChapters] = useState<string[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>();
  const [title, setTitle] = useState('...');

  const [page, setPage] = useState(1);
  const [showLocalesModal, setShowLocalesModal] = useState(false);

  const contentRating = [manga.attributes.contentRating]; //useContentRatingFitlers();
  const [fetchChapters, {data, loading, error}] =
    useLazyGetRequest<PagedResultsList<Chapter>>();
  const hasNextPage =
    data?.result === 'ok' && ids.length > data.offset + data.data.length;
  const hasPrevPage = data?.result === 'ok' && data.offset > 0;

  const primaryColor = useBackgroundColor('primary');
  const translateColor = preferredLanguages.length ? primaryColor : undefined;

  useEffect(() => {
    const limit = 100;
    const offset = (page - 1) * 100;
    const paginatedIds = ids.slice(offset, page * 100);

    fetchChapters(
      UrlBuilder.chaptersList({
        ids: paginatedIds,
        contentRating,
        order: {
          chapter: sortRule === SortRule.Asc ? 'asc' : 'desc',
          publishAt: 'asc',
        },
        translatedLanguage: preferredLanguages,
        limit,
        offset,
      }),
      {
        refreshSession: false,
        forceRefresh: false,
      },
    ).finally(() => {
      setSortButtonDisabled(false);
    });
    getReadMarkers();
  }, [page, sortRule, preferredLanguages]);

  useEffect(() => {
    updateSetting(
      'chaptersSortOrder',
      sortRule === SortRule.Asc ? 'asc' : 'desc',
    );
  }, [sortRule]);

  useEffect(() => {
    if (data?.result === 'ok') {
      setChapters(data.data);
    }
  }, [data]);

  const [getReadMarkers, {data: readMarkersData, status: readMarkersStatus}] =
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

  useEffect(() => {
    setTitle(
      volume === 'null' || volume === null ? 'No volume' : `Volume ${volume}`,
    );
  }, [volume]);

  if (loading || !requestStarted(readMarkersStatus)) {
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
          <View style={{flexShrink: 1, flexDirection: 'row'}}>
            <IconButton disabled icon="translate" color={translateColor} />
            <IconButton
              disabled
              icon={
                sortRule === SortRule.Desc
                  ? 'sort-descending'
                  : 'sort-ascending'
              }
            />
          </View>
        </View>
        <ActivityIndicator style={{flex: 1}} />
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

  if (chapters?.length) {
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
          <View style={{flexShrink: 1, flexDirection: 'row'}}>
            <IconButton
              icon="translate"
              onPress={() => setShowLocalesModal(true)}
              color={translateColor}
            />
            <IconButton
              disabled={sortButtonDisabled}
              icon={
                sortRule === SortRule.Desc
                  ? 'sort-descending'
                  : 'sort-ascending'
              }
              onPress={() => {
                setSortButtonDisabled(true);
                setSortOrder(current => current * -1);
              }}
            />
          </View>
        </View>
        <BasicList
          data={chapters}
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
        <LocaleSelectionModal
          selectedLocales={preferredLanguages}
          locales={manga.attributes.availableTranslatedLanguages}
          visible={showLocalesModal}
          onDismiss={() => setShowLocalesModal(false)}
          onSubmit={onPreferredLanguagesChange}
        />
      </View>
    );
  }

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
        <View style={{flexShrink: 1, flexDirection: 'row'}}>
          <IconButton
            icon="translate"
            color={translateColor}
            onPress={() => setShowLocalesModal(true)}
          />
          <IconButton
            disabled
            icon={
              sortRule === SortRule.Desc ? 'sort-descending' : 'sort-ascending'
            }
          />
        </View>
      </View>
      <Banner
        primaryAction={{
          content: 'Change language',
          onAction: () => setShowLocalesModal(true),
        }}
        secondaryAction={{content: 'Back', onAction: onCancel}}>
        No chapters were found for your current language selection.
      </Banner>
      <LocaleSelectionModal
        selectedLocales={preferredLanguages}
        locales={manga.attributes.availableTranslatedLanguages}
        visible={showLocalesModal}
        onDismiss={() => setShowLocalesModal(false)}
        onSubmit={onPreferredLanguagesChange}
      />
    </View>
  );
}
