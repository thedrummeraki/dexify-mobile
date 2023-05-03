import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Caption, Subheading, Text} from 'react-native-paper';
import {
  CoverSize,
  findRelationship,
  mangaImage,
  preferredMangaAuthor,
  preferredMangaTitle,
} from 'src/api';
import {Artist, Author, Chapter, Manga} from 'src/api/mangadex/types';
import {useTheme} from 'src/App';
import MangaThumbnail from 'src/components/MangaThumbnail';
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
  const author = preferredMangaAuthor(manga);

  const visibleChapters = chapters.slice(0, visibleChaptersCount);

  const authorPresent = Boolean(author && author.attributes);
  const imageUrl = mangaImage(manga, {size: CoverSize.Small});

  const gradientColors = useGradientColors();

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
          <Button compact>More...</Button>
        </View>
      </View>
    </View>
  );
}

function useGradientColors() {
  const theme = useTheme();
  const background = theme.dark ? '#000000' : '#f2f2f2';

  return [
    `${background}50`,
    `${background}20`,
    `${background}50`,
    `${background}A0`,
    `${background}D0`,
    `${background}FF`,
  ];
}
