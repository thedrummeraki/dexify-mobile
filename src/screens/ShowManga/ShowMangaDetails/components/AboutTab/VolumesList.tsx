import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, Modal, View} from 'react-native';
import {Chip, IconButton, Text, Title} from 'react-native-paper';
import {coverImage} from 'src/api';
import {Chapter, CoverArt, PagedResultsList} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import {
  CloseCurrentScreenHeader,
  FullScreenModal,
  TextBadge,
} from 'src/components';
import BasicList from 'src/components/BasicList';
import Thumbnail, {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {pluralize, useDimensions} from 'src/utils';
import {useMangaDetails} from '../../ShowMangaDetails';
import {ChapterItem} from './ChaptersList';

interface VolumeInfo {
  volume: string;
  chapterIds: string[];
  cover: CoverArt;
  title: string;
}

interface Props {
  volumesCount: number;
}

enum SortRule {
  Asc = -1,
  Desc = 1,
}

export default function VolumesList({volumesCount}: Props) {
  const savedVolumeRef = useRef<VolumeInfo | null>(null);
  const [showAllVolumes, setShowAllVolumes] = useState(false);
  const [sortRule, setSortOrder] = useState<SortRule>(SortRule.Desc);
  const [currentVolumeInfo, setCurrentVolumeInfo] = useState<VolumeInfo | null>(
    savedVolumeRef.current,
  );
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [updateChapters, {loading: chaptersLoading, error}] =
    useLazyGetRequest<PagedResultsList<Chapter>>();

  const onScreenFocus = useCallback(() => {
    console.log({savedVolume: savedVolumeRef.current});
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log({savedVolume: savedVolumeRef.current});
    }, []),
  );

  useEffect(() => {
    if (savedVolumeRef.current && !currentVolumeInfo) {
      setCurrentVolumeInfo(savedVolumeRef.current);
    }
  }, [savedVolumeRef.current]);

  const {covers, manga, aggregate, loading} = useMangaDetails();
  const itemWidth = useDimensions().width / 3 - 5 * 3;

  const visibleCovers = useMemo(() => {
    const sortedCovers = covers.sort((left, right) => {
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
    return showAllVolumes ? sortedCovers : sortedCovers.slice(0, 6);
  }, [covers, showAllVolumes, sortRule]);

  useEffect(() => {
    if (currentVolumeInfo?.chapterIds?.length) {
      const {chapterIds} = currentVolumeInfo;

      updateChapters(
        UrlBuilder.chaptersList({
          ids: chapterIds,
          limit: chapterIds.length,
          order: {chapter: 'asc'},
          contentRating: [manga.attributes.contentRating],
        }),
      ).then(response => {
        if (response?.result === 'ok') {
          setChapters(response.data);
        }
      });
    }
  }, [currentVolumeInfo]);

  const FooterComponent =
    visibleCovers.length < covers.length ? (
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Chip
          style={{
            padding: -10,
            backgroundColor: 'rgba(0,0,0,0)', // fully transparent
          }}
          onPress={() => setShowAllVolumes(x => !x)}>
          <Text style={{fontWeight: '900'}}>
            {showAllVolumes ? '- View less' : '+ View more'}
          </Text>
        </Chip>
      </View>
    ) : null;

  return (
    <View>
      <View style={{marginHorizontal: 15, marginTop: 20, marginBottom: -10}}>
        <View style={{flexDirection: 'row-reverse'}}>
          <IconButton
            icon={
              sortRule === SortRule.Desc ? 'sort-descending' : 'sort-ascending'
            }
            onPress={() => setSortOrder(current => current * -1)}
          />
          <IconButton icon="folder-multiple-image" onPress={() => {}} />
        </View>
      </View>
      <BasicList
        loading={loading}
        style={{margin: 8.5, marginTop: 15}}
        itemStyle={{padding: 5}}
        data={visibleCovers}
        renderItem={cover => {
          const volume = cover.attributes.volume;
          const title = volume === 'null' ? 'N/A' : `Volume ${volume}`;

          return (
            <Thumbnail
              imageUrl={coverImage(cover, manga.id)}
              width={itemWidth}
              height={160}
              title={title}
              onPress={() => {
                if (!volume || !aggregate) {
                  return;
                }

                console.log(Object.keys(aggregate), volume);

                const chapterIds = Object.entries(
                  aggregate[volume].chapters,
                ).map(([_, chapter]) => chapter.id);

                const currentVolumeInfo: VolumeInfo = {
                  volume,
                  chapterIds,
                  cover,
                  title,
                };
                setCurrentVolumeInfo(currentVolumeInfo);
                savedVolumeRef.current = currentVolumeInfo;
              }}
            />
          );
        }}
        skeletonItem={<ThumbnailSkeleton width={itemWidth} height={160} />}
        skeletonLength={6}
      />
      {FooterComponent}
      <FullScreenModal
        visible={currentVolumeInfo !== null}
        onDismiss={() => {
          setCurrentVolumeInfo(null);
          savedVolumeRef.current = null;
          setChapters([]);
        }}>
        {currentVolumeInfo && (
          <View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={chapters}
              keyExtractor={item => item.id}
              renderItem={({item: chapter}) => (
                <ChapterItem chapter={chapter} />
              )}
              ListHeaderComponentStyle={{marginBottom: 15}}
              ListHeaderComponent={
                <View style={{flexDirection: 'row'}}>
                  <Thumbnail
                    imageUrl={coverImage(currentVolumeInfo.cover, manga.id)}
                    width={'30%'}
                    height={160}
                  />
                  <View style={{width: '70%', paddingHorizontal: 10}}>
                    <Title>{currentVolumeInfo.title}</Title>
                    <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                      <TextBadge
                        background="primary"
                        content={`${pluralize(
                          currentVolumeInfo.chapterIds.length,
                          'chapter',
                        )}`}
                      />
                      {chapters.length ? (
                        <TextBadge
                          background="placeholder"
                          content={`${pluralize(chapters.length, 'page')}`}
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
              }
            />
          </View>
        )}
      </FullScreenModal>
    </View>
  );
}
