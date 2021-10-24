import React, {useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {
  Button,
  Caption,
  Chip,
  Paragraph,
  Text,
  Title,
} from 'react-native-paper';
import {
  contentRatingInfo,
  findRelationships,
  preferredMangaDescription,
  preferredMangaTitle,
  preferredTitle,
} from 'src/api';
import {Artist, Author, Manga} from 'src/api/mangadex/types';
import {ChipsContainer, TextBadge} from 'src/components';

interface Props {
  manga: Manga;
}

export default function AboutTab({manga}: Props) {
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
  const description = preferredMangaDescription(manga)?.trim();
  const partialAuthorsAndArtists = authorsAndArtists.slice(0, 5);

  const contentRating = manga.attributes.contentRating
    ? contentRatingInfo(manga.attributes.contentRating)
    : undefined;

  return (
    <ScrollView style={{padding: 5, flex: 1}}>
      <View style={{flex: 1, marginTop: -5}}>
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
      <View style={{flex: 1, marginTop: 17, marginBottom: 12}}>
        <Button icon="play" mode="contained" style={{marginVertical: 3}}>
          Read Chapter 1 now
        </Button>
        <Button icon="plus" mode="outlined" style={{marginVertical: 3}}>
          Add to library
        </Button>
      </View>
      <View>
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
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          marginTop: 10,
        }}>
        <Text style={{marginRight: 6}}>Made by:</Text>
        {authorsAndArtists.map(artist => (
          <TextBadge
            key={artist.id}
            content={artist.attributes.name}
            background="surface"
            // onPress={() => console.log('selected', artist.attributes.name)}
          />
        ))}
      </View>
      <ChipsContainer
        data={manga.attributes.tags}
        keyExtractor={tag => tag.id}
        style={{marginHorizontal: -3, marginTop: 13}}
        itemStyle={{paddingHorizontal: 3, paddingVertical: 5}}
        renderChip={item => <Chip icon="tag">{item.attributes.name.en}</Chip>}
      />
    </ScrollView>
  );
}
