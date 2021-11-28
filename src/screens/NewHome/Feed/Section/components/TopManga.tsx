import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Title, Caption, Text, Button} from 'react-native-paper';
import {
  mangaImage,
  CoverSize,
  preferredMangaTitle,
  preferredTitle,
  preferredMangaDescription,
} from 'src/api';
import {Manga} from 'src/api/mangadex/types';
import {ImageGradient} from 'src/components';

interface Props {
  manga: Manga;
}

export default function TopManga({manga}: Props) {
  const description = preferredMangaDescription(manga);

  return (
    <View>
      <ImageGradient />

      <FastImage
        source={{
          uri: mangaImage(manga, {size: CoverSize.Original}),
        }}
        style={{width: '100%', aspectRatio: 1.2}}
        resizeMode="cover"
      />
      <View
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          zIndex: 1,
          marginHorizontal: 20,
        }}>
        <Title>{preferredMangaTitle(manga)}</Title>
        {description && (
          <Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize: 12}}>
            {description}
          </Text>
        )}

        <Button
          mode="contained"
          style={{width: '50%', marginTop: 15, marginBottom: -10}}>
          Read now
        </Button>
      </View>
    </View>
  );
}
