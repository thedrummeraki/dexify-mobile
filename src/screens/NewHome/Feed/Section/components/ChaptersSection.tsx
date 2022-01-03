import React from 'react';
import {View, TouchableNativeFeedback, Image} from 'react-native';
import {Caption, Text, useTheme} from 'react-native-paper';
import {
  findRelationship,
  preferredChapterTitle,
  preferredMangaTitle,
} from 'src/api';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {ScanlationGroup} from 'src/api/mangadex/types';
import {TextBadge} from 'src/components';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import MangaThumbnail from 'src/components/MangaThumbnail';
import {useDexifyNavigation} from 'src/foundation';
import {Sections} from '../types';
import {localizedDateTime} from 'src/utils';
import {DateTime} from 'luxon';

interface Props {
  section: Sections.Chapters;
  hideIfEmpty?: boolean;
}

export default function ChaptersSection({section, hideIfEmpty = true}: Props) {
  const navigation = useDexifyNavigation();
  const {title, chapters, manga, viewMore: onAction} = section;
  const {
    colors: {surface},
  } = useTheme();

  if (chapters.length === 0 && hideIfEmpty) {
    return null;
  }

  return (
    <CategoriesCollectionSection
      title={title}
      data={chapters}
      viewMore={onAction ? {onAction} : undefined}
      dimensions={{width: 120, height: 160}}
      renderItem={(item, {width, height}) => {
        const relatedManga = manga.find(
          manga => manga.id === findRelationship(item, 'manga')!.id,
        )!;

        return (
          <TouchableNativeFeedback
            useForeground
            onPress={() => navigation.push('ShowChapter', {id: item.id})}
            onLongPress={() => {
              ReactNativeHapticFeedback.trigger('soft');
              navigation.push('ShowManga', {
                ...relatedManga,
                // jumpToVolume: item.attributes.volume,
              });
            }}>
            <View
              style={{
                position: 'relative',
                width,
                height,
                backgroundColor: surface,
              }}>
              <View style={{position: 'absolute', opacity: 0.15}}>
                <MangaThumbnail
                  hideAuthor
                  hideTitle
                  manga={relatedManga}
                  width={width}
                  aspectRatio={0.8}
                />
              </View>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  padding: 5,
                }}>
                <Text
                  numberOfLines={1}
                  style={{fontSize: 12, fontStyle: 'italic'}}>
                  {preferredChapterTitle(item)}
                </Text>
                <Caption>
                  {item.attributes.volume
                    ? `Volume ${item.attributes.volume}`
                    : 'No volume'}
                </Caption>
                <Text style={{fontWeight: 'bold'}}>
                  {item.attributes.translatedLanguage.toLocaleUpperCase()}
                </Text>
              </View>
              <View
                style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
                <TextBadge
                  content={localizedDateTime(
                    item.attributes.publishAt,
                    DateTime.DATE_MED,
                  )}
                />
                <TextBadge
                  icon="book"
                  content={preferredMangaTitle(relatedManga)}
                  numberOfLines={1}
                />
                <TextBadge
                  icon="account"
                  content={
                    findRelationship<ScanlationGroup>(item, 'scanlation_group')
                      ?.attributes.name
                  }
                  numberOfLines={1}
                  textStyle={{fontSize: 11}}
                />
              </View>
            </View>
          </TouchableNativeFeedback>
        );
      }}
    />
  );
}
