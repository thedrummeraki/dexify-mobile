import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useMangaDetails, VolumeInfo} from '../../../ShowMangaDetails';
import {Image, TouchableNativeFeedback, View} from 'react-native';
import {
  Caption,
  IconButton,
  ProgressBar,
  Text,
  useTheme,
} from 'react-native-paper';
import {coverImage} from 'src/api';
import BasicList from 'src/components/BasicList';
import {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {pluralize, useDimensions} from 'src/utils';
import {useDexifyNavigation} from 'src/foundation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useContinueReadingChaptersList,
  useSettingsContext,
} from 'src/prodivers';
import LocaleSelectionModal from './LocaleSelectionModal';
import {useBackgroundColor} from 'src/components/colors';

enum SortRule {
  Asc = -1,
  Desc = 1,
}

interface Props {
  defaultCoverUrl?: string;
  jumpToVolume?: string | null;
  onVolumeSelect(volumeInfo: VolumeInfo | null): void;
}

export default function VolumesList({
  defaultCoverUrl,
  jumpToVolume,
  onVolumeSelect,
}: Props) {
  const successfulJumpToVolume = useRef(false);
  const navigation = useDexifyNavigation();
  const theme = useTheme();
  const {settings, updateSetting} = useSettingsContext();
  const [showLocalesModal, setShowLocalesModal] = useState(false);
  const [sortRule, setSortOrder] = useState<SortRule>(
    settings.volumeSortOrder === 'desc' ? SortRule.Desc : SortRule.Asc,
  );

  const {
    covers,
    manga,
    volumeInfos,
    loading,
    preferredLanguages,
    onPreferredLanguagesChange,
  } = useMangaDetails();
  const itemWidth = useDimensions().width / 3 - 5 * 3;

  const continueReadingChapters = useContinueReadingChaptersList();

  const primaryColor = useBackgroundColor('primary');
  const translateColor = preferredLanguages.length ? primaryColor : undefined;

  const sortedVolumeInfos = useMemo(() => {
    return volumeInfos.sort((left, right) => {
      const volumeLeft = left.volume;
      const volumeRight = right.volume;

      if (volumeLeft === volumeRight) {
        return 0;
      }

      if (volumeLeft === null || volumeRight === null) {
        if (volumeLeft === null) {
          return -1 * sortRule;
        } else if (volumeRight === null) {
          return 1 * sortRule;
        }
      }

      const volumeLeftNum = parseFloat(volumeLeft);
      const volumeRightNum = parseFloat(volumeRight);

      if (volumeLeftNum > -1 && volumeRightNum > -1) {
        return (volumeLeftNum > volumeRightNum ? -1 : 1) * sortRule;
      }

      return (volumeLeft > volumeRight ? -1 : 1) * sortRule;
    });
  }, [volumeInfos, sortRule]);

  useEffect(() => {
    updateSetting(
      'volumeSortOrder',
      sortRule === SortRule.Asc ? 'asc' : 'desc',
    );
  }, [sortRule]);

  useEffect(() => {
    if (jumpToVolume !== undefined && !successfulJumpToVolume.current) {
      const foundVolumeInfo = volumeInfos.find(
        volumeInfo => volumeInfo.volume === jumpToVolume,
      );
      if (foundVolumeInfo) {
        onVolumeSelect(foundVolumeInfo);
        successfulJumpToVolume.current = true;
      }
    }
  }, [jumpToVolume, onVolumeSelect, volumeInfos]);

  return (
    <View>
      <View style={{marginBottom: -10}}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconButton
            icon={
              sortRule === SortRule.Desc ? 'sort-descending' : 'sort-ascending'
            }
            onPress={() => setSortOrder(current => current * -1)}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* {hasLinks ? (
              <TextBadge
                content="External links"
                icon="hand-peace"
                background="placeholder"
                style={{borderRadius: 7}}
                onPress={() => {}}
              />
            ) : null} */}
            <IconButton
              icon="translate"
              onPress={() => setShowLocalesModal(true)}
              color={translateColor}
            />
            <IconButton
              icon="palette"
              onPress={() => navigation.push('ShowMangaGallery', {manga})}
            />
          </View>
          {/* <Button
            disabled={covers.length === 0}
            mode="outlined"
            icon="palette"
            onPress={() => navigation.push('ShowMangaGallery', {manga})}>
            Covers
          </Button> */}
        </View>
      </View>
      <BasicList
        loading={loading}
        style={{margin: 8.5, marginTop: 15}}
        itemStyle={{padding: 5}}
        data={sortedVolumeInfos.map(info => ({id: info.volume, ...info}))}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}>
            <Icon name="folder-open-outline" style={{fontSize: 30}} />
            <Caption style={{textAlign: 'center'}}>
              No volumes were found for your language.
            </Caption>
          </View>
        }
        renderItem={volumeInfo => {
          const volume = volumeInfo.volume;
          const title =
            volume === 'null' || volume === null
              ? 'No volume'
              : `Volume ${volume}`;
          const cover = covers.find(
            cover => cover.attributes.volume === volume,
          );
          const reading = continueReadingChapters.filter(chapter =>
            volumeInfo.chapterIds.includes(chapter.id),
          );
          const chapterProgress = reading.length / volumeInfo.chapterIds.length;
          const readingPrgress = reading.length
            ? reading
                .map(chapter => chapter.currentPage / chapter.totalPageCount)
                .reduce((a, b) => a + b) / reading.length
            : 0;

          return (
            <TouchableNativeFeedback
              onPress={() => {
                onVolumeSelect(volumeInfo);
              }}
              background={TouchableNativeFeedback.Ripple('#fff', false)}>
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                }}>
                <Image
                  source={{
                    uri: cover
                      ? coverImage(cover, manga.id)
                      : 'https://mangadex.org/img/avatar.png',
                  }}
                  width={itemWidth}
                  style={{
                    width: itemWidth,
                    aspectRatio: 1.25,
                    opacity: cover ? 0.4 : 0.2,
                  }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingHorizontal: 5,
                  }}>
                  <Text>{title}</Text>
                  <Caption style={{marginTop: -3}}>
                    {volumeInfo.chapterIds.length
                      ? pluralize(volumeInfo.chapterIds.length, 'chapter')
                      : 'N/A'}
                  </Caption>
                </View>
                {reading.length > 0 ? (
                  <ProgressBar
                    progress={readingPrgress * chapterProgress}
                    style={{height: 1}}
                  />
                ) : null}
              </View>
            </TouchableNativeFeedback>
          );
        }}
        skeletonItem={
          <ThumbnailSkeleton width={itemWidth} height={itemWidth / 1.25} />
        }
        skeletonLength={6}
      />
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
