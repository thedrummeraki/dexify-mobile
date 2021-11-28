import React from 'react';
import {View} from 'react-native';
import {Button, Card, Paragraph, Title, useTheme} from 'react-native-paper';
import {
  contentRatingInfo,
  CoverSize,
  findRelationship,
  mangaImage,
  preferredMangaDescription,
  preferredMangaTitle,
  preferredTitle,
} from 'src/api';
import {Artist, Author} from 'src/api/mangadex/types';
import MangaThumbnail from 'src/components/MangaThumbnail';
import {useDexifyNavigation} from 'src/foundation';
import {Sections} from '../types';

interface Props {
  section: Sections.MangaRecommendation;
}

export default function MangaRecommendationSection({section: {manga}}: Props) {
  const navigation = useDexifyNavigation();
  const theme = useTheme();

  const author =
    findRelationship<Author>(manga, 'author') ||
    findRelationship<Artist>(manga, 'artist');
  const relavantInfo = [
    author ? `${author.attributes.name}` : null,
    manga.attributes.contentRating
      ? contentRatingInfo(manga.attributes.contentRating).content
      : null,
    manga.attributes.year ? `Released in ${manga.attributes.year}` : null,
  ]
    .filter(text => text)
    .join(' - ');

  return (
    <Card mode="outlined" style={{marginHorizontal: 20}}>
      <Card.Title title={preferredMangaTitle(manga)} subtitle={relavantInfo} />
      <Card.Cover
        source={{uri: mangaImage(manga, {size: CoverSize.Original})}}
      />
      <Card.Content>
        <Paragraph
          numberOfLines={3}
          style={{
            marginTop: 15,
            fontSize: 12,
            lineHeight: 16,
            color: theme.colors.disabled,
          }}>
          {preferredMangaDescription(manga)}
        </Paragraph>
      </Card.Content>
      <Card.Actions style={{justifyContent: 'flex-end'}}>
        <Button onPress={() => navigation.push('ShowManga', manga)}>
          Learn more
        </Button>
        <Button disabled>Read now</Button>
      </Card.Actions>
    </Card>
  );
}
