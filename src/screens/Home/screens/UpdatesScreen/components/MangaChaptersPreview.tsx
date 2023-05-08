import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, Subheading} from 'react-native-paper';
import {CoverSize, mangaImage, preferredMangaTitle} from 'src/api';
import {Chapter, Manga} from 'src/api/mangadex/types';
import {useTheme} from 'src/App';
import {useDexifyNavigation} from 'src/foundation';
import ChapterPreview from './ChapterPreview';

interface Props {
  manga: Manga;
  chapters: Chapter[];
  visibleChaptersCount?: number;
}

export default function MangaChaptersPreview({
  manga,
  chapters,
  visibleChaptersCount = 3,
}: Props) {
  const theme = useTheme();
  const navigation = useDexifyNavigation();

  const visibleChapters = chapters.slice(0, visibleChaptersCount);

  const imageUrl = mangaImage(manga, {size: CoverSize.Small});

  return (
    <View>
      <View
        style={{
          backgroundColor: theme.colors.card,
          borderWidth: 1,
        }}>
        <View style={{padding: 4}}>
          <Subheading numberOfLines={1}>
            {preferredMangaTitle(manga)}
          </Subheading>
        </View>
        {visibleChapters.map((chapter, index) => (
          <ChapterPreview
            key={chapter.id}
            chapter={chapter}
            showSeparator={index < visibleChapters.length - 1}
          />
        ))}
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            left: 0,
            opacity: 0.1,
          }}>
          <Image
            source={{uri: imageUrl}}
            style={{height: '100%', width: '100%'}}
          />
        </View>
        <View
          style={{
            borderBottomColor: theme.colors.placeholder,
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <View style={{flexDirection: 'row-reverse'}}>
          <Button
            compact
            onPress={() => navigation.push('ShowManga', {...manga})}>
            View manga
          </Button>
        </View>
      </View>
    </View>
  );
}
