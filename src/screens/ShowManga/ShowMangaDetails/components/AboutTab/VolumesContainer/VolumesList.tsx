import React, {useEffect, useMemo, useState} from 'react';
import {useMangaDetails, VolumeInfo} from '../../../ShowMangaDetails';
import {Image, TouchableNativeFeedback, View} from 'react-native';
import {Caption, IconButton, ProgressBar, Text} from 'react-native-paper';
import {coverImage} from 'src/api';
import {TextBadge} from 'src/components';
import BasicList from 'src/components/BasicList';
import {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {pluralize, useDimensions} from 'src/utils';
import {useDexifyNavigation} from 'src/foundation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useContinueReadingChaptersList,
  useSettingsContext,
} from 'src/prodivers';

enum SortRule {
  Asc = -1,
  Desc = 1,
}

interface Props {
  defaultCoverUrl?: string;
  onVolumeSelect(volumeInfo: VolumeInfo | null): void;
}

export default function VolumesList({defaultCoverUrl, onVolumeSelect}: Props) {
  const navigation = useDexifyNavigation();
  const {settings, updateSetting} = useSettingsContext();
  const [sortRule, setSortOrder] = useState<SortRule>(
    settings.volumeSortOrder === 'desc' ? SortRule.Desc : SortRule.Asc,
  );

  const {covers, manga, volumeInfos, loading} = useMangaDetails();
  const itemWidth = useDimensions().width / 3 - 5 * 3;

  const continueReadingChapters = useContinueReadingChaptersList();
  const hasLinks = Object.keys(manga.attributes.links || {}).length > 0;

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

  return (
    <View>
      <View style={{marginTop: 20, marginBottom: -10}}>
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
            {hasLinks ? (
              <TextBadge
                content="External links"
                icon="hand-peace"
                background="placeholder"
                style={{borderRadius: 7}}
                onPress={() => {}}
              />
            ) : null}
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
              Art
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
              <View>
                <Image
                  source={{
                    uri: cover
                      ? coverImage(cover, manga.id)
                      : defaultCoverUrl || 'https://mangadex.org/avatar.png',
                  }}
                  width={itemWidth}
                  style={{width: itemWidth, aspectRatio: 1.25, opacity: 0.4}}
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
    </View>
  );
}
