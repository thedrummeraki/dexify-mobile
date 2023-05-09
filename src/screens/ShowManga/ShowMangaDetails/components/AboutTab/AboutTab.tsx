import React, {useEffect, useRef, useState} from 'react';
import {Linking, ScrollView, View} from 'react-native';
import {IconButton, Paragraph} from 'react-native-paper';
import {
  contentRatingInfo,
  findRelationship,
  getPublisher,
  mangaRelationships,
  preferredMangaDescription,
  preferredMangaTitle,
} from 'src/api';
import {
  AllReadingStatusResponse,
  Artist,
  Author,
  ContentRating,
  ReadingStatus,
} from 'src/api/mangadex/types';
import {
  FullScreenModal,
  MangaRelationshipsCollection,
  ShareButton,
  TextBadge,
} from 'src/components';
import {useBackgroundColor} from 'src/components/colors';
import TopManga, {
  TopMangaDescription,
} from 'src/screens/NewHome/MangadexHome/components/TopManga';
import {useMangaDetails} from '../../ShowMangaDetails';
import VolumesContainer from './VolumesContainer';
import {useIsLoggedIn, useLibraryContext} from 'src/prodivers';
import {
  AddToLibraryModal,
  AddToMDListModal,
  ShowMangaDetailsModal,
  AiringAnimeModal,
} from './modals';
import {FollowMangaAction, LibraryAction} from './actions';
import {useLazyGetRequest} from 'src/api/utils';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {capitalize, wait} from 'src/utils';
import {useDexifyNavigation, useShowMangaRoute} from 'src/foundation';

export default function AboutTab() {
  const navigation = useDexifyNavigation();
  const {manga, isAiring, statistics} = useMangaDetails();
  const loggedIn = useIsLoggedIn();
  const {
    params: {jumpToVolume},
  } = useShowMangaRoute();

  const {refreshReadingStatuses} = useLibraryContext();
  const hasOpenedRelatedMangaModal = useRef(false);

  const [modalsState, setSetModalsState] = useState({
    addToMDList: false,
    addToLibrary: false,
    showDetails: false,
    airingAnime: false,
    relatedManga: false,
  });

  const [getReadingStatus, {data, loading}] =
    useLazyGetRequest<AllReadingStatusResponse>(
      UrlBuilder.buildUrl('/manga/status'),
    );

  const [readingStatus, setReadingStatus] = useState<ReadingStatus | null>();
  const [readingStatusChanged, setReadingStatusChanged] = useState(false);

  useEffect(() => {
    if (data?.statuses && Object.keys(data.statuses).includes(manga.id)) {
      setReadingStatus(data.statuses[manga.id]);
    }
  }, [data]);

  useEffect(() => {
    wait(1).then(() => getReadingStatus());
  }, []);

  // closes the related mangas modal when clicking on another manga
  useEffect(() => {
    if (modalsState.relatedManga && !hasOpenedRelatedMangaModal.current) {
      hasOpenedRelatedMangaModal.current = true;
    } else if (modalsState.relatedManga && hasOpenedRelatedMangaModal.current) {
      setSetModalsState(current => ({...current, relatedManga: false}));
    }
  }, [manga, modalsState]);

  const author =
    findRelationship<Author>(manga, 'author') ||
    findRelationship<Artist>(manga, 'artist');

  const description = preferredMangaDescription(manga)?.trim();

  const contentRating = contentRatingInfo(manga.attributes.contentRating);
  const contentRatingTextColor = useBackgroundColor(contentRating?.background);

  const related = mangaRelationships(manga);

  const basicInfoMarkup = (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          marginTop: 10,
        }}>
        <TextBadge
          content={contentRating.content}
          icon={contentRating.icon}
          textStyle={{color: contentRatingTextColor}}
          background="none"
        />
        <TextBadge content={capitalize(manga.attributes.status)} />
        {manga.attributes.year && (
          <TextBadge content={manga.attributes.year} background="none" />
        )}
        {statistics?.rating.average && (
          <TextBadge
            icon="star"
            content={statistics.rating.average.toFixed(2)}
            onPress={() => {}}
          />
        )}
        {isAiring && (
          <TextBadge
            content="Anime airing"
            icon="video"
            background="primary"
            onPress={() =>
              setSetModalsState(current => ({...current, airingAnime: true}))
            }
          />
        )}
      </View>
    </View>
  );

  const topMangaDescription: TopMangaDescription = [];
  if (author) {
    topMangaDescription.push({
      content: author.attributes.name,
      onPress: () => {
        navigation.push('ShowArtist', {
          id: author.id,
          allowHentai:
            manga.attributes.contentRating === ContentRating.pornographic,
        });
      },
    });
  }

  // if there's no publisher link, there will not be a publisher name
  const publisherLink = manga.attributes.links?.raw;
  if (publisherLink) {
    topMangaDescription.push({
      content: getPublisher(manga)!,
      onPress: () => {
        Linking.openURL(publisherLink);
      },
    });
  }

  return (
    <>
      {/* <View
        style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
        <StartReadingButton icon="play" />
      </View> */}
      {/* <ChaptersList
        ListHeaderComponent={chaptersListHeaderMarkup}
        ListFooterComponent={chaptersListFooterMarkup}
      /> */}
      <ScrollView>
        <TopManga
          allowCloseScreen
          description={topMangaDescription}
          manga={manga}
          aspectRatio={1.2}
          FooterComponent={basicInfoMarkup}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: -15,
          }}>
          <View style={{flexGrow: 1, flexDirection: 'row'}}>
            <LibraryAction
              readingStatus={readingStatus}
              loading={loading}
              onPress={() =>
                setSetModalsState(current => ({
                  ...current,
                  addToLibrary: true,
                }))
              }
            />
            <IconButton
              icon="playlist-plus"
              disabled={!loggedIn}
              onPress={() =>
                setSetModalsState(current => ({
                  ...current,
                  addToMDList: true,
                }))
              }
            />
            <FollowMangaAction />
          </View>
          <View style={{flexShrink: 1, flexDirection: 'row'}}>
            <IconButton
              icon="book-open-variant"
              disabled={related.length === 0}
              onPress={() =>
                setSetModalsState(current => ({
                  ...current,
                  relatedManga: true,
                }))
              }
            />
            <ShareButton resource={manga} title={preferredMangaTitle(manga)} />
          </View>
        </View>
        <View style={{marginHorizontal: 15}}>
          <Paragraph numberOfLines={2}>{description}</Paragraph>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TextBadge
              content="Learn more"
              background="background"
              style={{borderRadius: 10, marginTop: 5, paddingHorizontal: 5}}
              onPress={() =>
                setSetModalsState(current => ({
                  ...current,
                  showDetails: true,
                }))
              }
            />
          </View>
        </View>
        <VolumesContainer jumpToVolume={jumpToVolume} />
      </ScrollView>
      <AddToLibraryModal
        readingStatus={readingStatus}
        loading={loading}
        visible={modalsState.addToLibrary}
        onReadingStatusUpdate={newReadingStatus => {
          setReadingStatus(newReadingStatus);
          setReadingStatusChanged(readingStatus !== newReadingStatus);
        }}
        onDismiss={() => {
          setSetModalsState(current => ({...current, addToLibrary: false}));
          if (readingStatusChanged) {
            wait(500)
              .then(refreshReadingStatuses)
              .finally(() => setReadingStatusChanged(false));
          }
        }}
      />
      <AddToMDListModal
        visible={modalsState.addToMDList}
        onDismiss={() =>
          setSetModalsState(current => ({...current, addToMDList: false}))
        }
      />
      <ShowMangaDetailsModal
        visible={modalsState.showDetails}
        onDismiss={() =>
          setSetModalsState(current => ({...current, showDetails: false}))
        }
      />
      <AiringAnimeModal
        loading={loading}
        visible={modalsState.airingAnime}
        onDismiss={() =>
          setSetModalsState(current => ({...current, airingAnime: false}))
        }
      />
      <FullScreenModal
        visible={modalsState.relatedManga}
        title="Related manga"
        onDismiss={() => {
          setSetModalsState(current => ({...current, relatedManga: false}));
        }}>
        <MangaRelationshipsCollection relatedManga={related} />
      </FullScreenModal>
    </>
  );
}
