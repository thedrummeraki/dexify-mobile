import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Button,
  Caption,
  Chip,
  IconButton,
  Paragraph,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';
import {
  contentRatingInfo,
  CoverSize,
  findRelationships,
  mangaImage,
  preferredMangaDescription,
  preferredMangaTitle,
  preferredTitle,
} from 'src/api';
import {Artist, Author, Manga} from 'src/api/mangadex/types';
import {ChipsContainer, TextBadge} from 'src/components';
import {useDexifyNavigation} from 'src/foundation';
import {useMangaDetails} from '../ShowMangaDetails';

export default function AboutTab() {
  const {manga, loading, aggregate, coverUrl} = useMangaDetails();

  const navigation = useDexifyNavigation();
  const initialTrim = useRef(false);

  const authors = findRelationships<Author>(manga, 'author');
  const artists = findRelationships<Artist>(manga, 'artist');

  const authorsAndArtistsObjects: Array<Author | Artist> = [];
  artists.forEach(artist => authorsAndArtistsObjects.push(artist));
  authors.forEach(author => authorsAndArtistsObjects.push(author));

  const authorsAndArtists = authorsAndArtistsObjects.filter(
    (value, index, self) => self.findIndex(v => v.id === value.id) === index,
  );

  const [showingFullDescripiton, setShowingFullDescripiton] = useState(true);
  const [descriptionTrimmable, setDescriptionTrimmable] = useState(false);

  const altTitle = manga.attributes.altTitles.find(
    title => title.jp || title.en || title[manga.attributes.originalLanguage],
  );
  const altTitles = manga.attributes.altTitles.map(
    title => Object.entries(title).map(([_, value]) => value)[0],
  );
  const description = preferredMangaDescription(manga)?.trim();
  const aggregateEntries = Object.entries(aggregate || {});
  const chapterToRead =
    aggregateEntries.length > 0
      ? Object.entries(aggregateEntries[0][1].chapters)[0][1]
      : null;

  const readFirstChapter = useCallback(() => {
    if (chapterToRead) {
      navigation.navigate('ShowChapter', {id: chapterToRead.id});
    }
  }, [chapterToRead]);

  const contentRating = manga.attributes.contentRating
    ? contentRatingInfo(manga.attributes.contentRating)
    : undefined;

  return (
    <ScrollView style={{flex: 1}}>
      <FastImage
        source={{uri: coverUrl || mangaImage(manga, {size: CoverSize.Medium})}}
        style={{width: '100%', aspectRatio: 2}}
      />
      <View style={{padding: 5}}>
        <View style={{flex: 1}}>
          <Title>{preferredMangaTitle(manga)}</Title>
          {altTitle && (
            <Caption style={{marginTop: -3, fontWeight: '700'}}>
              {preferredTitle(altTitle)}
            </Caption>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
              marginTop: 7,
            }}>
            {contentRating && <TextBadge {...contentRating} />}
            {manga.attributes.publicationDemographic && (
              <TextBadge
                content={manga.attributes.publicationDemographic}
                background="disabled"
              />
            )}
            {manga.attributes.year && (
              <TextBadge content={manga.attributes.year} />
            )}
          </View>
        </View>
        <View style={{flex: 1, marginTop: 22, marginBottom: 12}}>
          {loading && (
            <Button loading mode="contained" style={{marginVertical: 3}}>
              {''}
            </Button>
          )}
          {!loading && chapterToRead && (
            <Button
              icon="play"
              mode="contained"
              style={{marginVertical: 3}}
              onPress={readFirstChapter}>
              Start reading now
            </Button>
          )}
          <Button icon="plus" mode="outlined" style={{marginVertical: 3}}>
            Add to library
          </Button>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginTop: 3,
          }}>
          <Text style={{marginRight: 6}}>Made by:</Text>
          {authorsAndArtists.map(artist => (
            <TextBadge
              key={artist.id}
              content={artist.attributes.name}
              background="surface"
            />
          ))}
        </View>
        <View style={{marginTop: 10}}>
          <Paragraph
            numberOfLines={showingFullDescripiton ? undefined : 4}
            onTextLayout={({nativeEvent}) => {
              if (!initialTrim.current) {
                setShowingFullDescripiton(nativeEvent.lines.length <= 4);
                setDescriptionTrimmable(nativeEvent.lines.length > 4);
                initialTrim.current = true;
              }
            }}>
            {description || (
              <Caption style={{fontStyle: 'italic'}}>
                No description was added for ${preferredMangaTitle(manga)}
              </Caption>
            )}
          </Paragraph>
          {descriptionTrimmable ? (
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
                onPress={() =>
                  setShowingFullDescripiton(!showingFullDescripiton)
                }>
                <Text style={{fontWeight: '900'}}>
                  {showingFullDescripiton ? '- View less' : '+ View more'}
                </Text>
              </Chip>
            </View>
          ) : null}
        </View>
        <View
          style={{
            display: 'none',
            flex: 1,
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <IconButton icon="thumb-up" size={36} onPress={() => {}} />
          <IconButton icon="eye" size={36} onPress={() => {}} />
          <IconButton icon="download" size={36} onPress={() => {}} />
          <IconButton icon="share-variant" size={36} onPress={() => {}} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginTop: 10,
            marginBottom: 30,
          }}>
          <Text style={{marginRight: 6}}>Genres:</Text>
          {manga.attributes.tags.map(tag => (
            <TextBadge
              key={tag.id}
              background="disabled"
              content={tag.attributes.name.en}
              onPress={() => {}}
            />
          ))}
        </View>
        <View
          style={{
            display: 'none',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginVertical: 10,
          }}>
          <Text style={{marginRight: 6}}>Also known as:</Text>
          {altTitles.map(title => (
            <TextBadge key={title} content={title} background="surface" />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
