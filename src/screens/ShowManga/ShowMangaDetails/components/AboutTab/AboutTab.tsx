import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Paragraph} from 'react-native-paper';
import {
  contentRatingInfo,
  findRelationship,
  preferredMangaDescription,
} from 'src/api';
import {
  AllReadingStatusResponse,
  Artist,
  Author,
  ReadingStatus,
} from 'src/api/mangadex/types';
import {TextBadge} from 'src/components';
import {useBackgroundColor} from 'src/components/colors';
import TopManga from 'src/screens/NewHome/Feed/Section/components/TopManga';
import {useMangaDetails} from '../../ShowMangaDetails';
import VolumesContainer from './VolumesContainer';
import {useIsLoggedIn, useLibraryContext} from 'src/prodivers';
import {
  AddToLibraryModal,
  AddToMDListModal,
  ShowMangaDetailsModal,
} from './modals';
import {FollowMangaAction, LibraryAction} from './actions';
import {useLazyGetRequest} from 'src/api/utils';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {wait} from 'src/utils';
import {useShowMangaRoute} from 'src/foundation';

export default function AboutTab() {
  const {manga, isAiring} = useMangaDetails();
  const loggedIn = useIsLoggedIn();
  const {
    params: {jumpToVolume},
  } = useShowMangaRoute();

  const {refreshReadingStatuses} = useLibraryContext();

  const [modalsState, setSetModalsState] = useState({
    addToMDList: false,
    addToLibrary: false,
    showDetails: false,
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

  const author =
    findRelationship<Author>(manga, 'author') ||
    findRelationship<Artist>(manga, 'artist');

  const description = preferredMangaDescription(manga)?.trim();

  const contentRating = contentRatingInfo(manga.attributes.contentRating);
  const contentRatingTextColor = useBackgroundColor(contentRating?.background);

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
        />
        {isAiring && (
          <TextBadge content="Anime airing" icon="video" background="primary" />
        )}
        {manga.attributes.year && <TextBadge content={manga.attributes.year} />}
      </View>
    </View>
  );

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
          description={author?.attributes.name}
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
          <FollowMangaAction />
          <Button
            disabled={!loggedIn}
            icon="plus"
            uppercase={false}
            onPress={() =>
              setSetModalsState(current => ({
                ...current,
                addToMDList: true,
              }))
            }>
            ADD TO MDList
          </Button>
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
    </>
  );
}
