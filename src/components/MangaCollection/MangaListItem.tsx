import React from 'react';
import {Dimensions, Image, TouchableNativeFeedback, View} from 'react-native';
import {Caption, Text, useTheme} from 'react-native-paper';
import {
  CoverSize,
  findRelationship,
  mangaImage,
  preferredMangaTitle,
} from 'src/api';
import {Artist, Author, Manga} from 'src/api/mangadex/types';
import {useDexifyNavigation} from 'src/foundation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Skeleton from './MangaListItemSkeleton';
import MangaThumbnail from '../MangaThumbnail';

interface Props {
  manga: Manga;
  selected?: boolean;
}

export function MangaListItem({manga, selected}: Props) {
  const imageWidth = 70;
  const width = Dimensions.get('window').width - 15 * 2 - imageWidth - 5 * 3;
  const navigation = useDexifyNavigation();
  const by =
    findRelationship<Author>(manga, 'author') ||
    findRelationship<Artist>(manga, 'artist');

  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: 5,
      }}>
      <TouchableNativeFeedback
        useForeground
        onPress={() => navigation.push('ShowManga', manga)}
        style={{width: '100%'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {selected ? (
            <View
              style={{
                width: imageWidth,
                aspectRatio: 1,
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="check" style={{color: '#000', fontSize: 24}} />
            </View>
          ) : (
            <MangaThumbnail
              hideAuthor
              hideTitle
              manga={manga}
              width={imageWidth}
              aspectRatio={1}
              coverSize={CoverSize.Small}
            />
          )}
          <View style={{paddingVertical: 5, paddingHorizontal: 15, width}}>
            <Text
              numberOfLines={by ? 1 : 2}
              style={{width, fontWeight: selected ? 'bold' : 'normal'}}>
              {preferredMangaTitle(manga)}
            </Text>
            {by ? (
              <Caption style={{marginTop: 0}}>{by?.attributes.name}</Caption>
            ) : null}
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

MangaListItem.Skeleton = Skeleton;
