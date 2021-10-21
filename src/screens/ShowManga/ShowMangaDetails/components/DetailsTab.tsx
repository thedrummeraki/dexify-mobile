import React, {useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {
  Avatar,
  Caption,
  Chip,
  Paragraph,
  Text,
  Title,
} from 'react-native-paper';
import {useTabNavigation} from 'react-native-paper-tabs';
import {preferredMangaDescription, preferredMangaTitle} from 'src/api';
import {Artist, Author, Manga} from 'src/api/mangadex/types';
import {ChipsContainer} from 'src/components';

interface Props {
  manga: Manga;
  authorsAndArtists: Array<Author | Artist>;
}

export default function ShowMangaDetailsDetailsTab({
  manga,
  authorsAndArtists,
}: Props) {
  const initialTrim = useRef(false);
  const [showingFullDescripiton, setShowingFullDescripiton] = useState(true);
  const [descriptionTrimmable, setDescriptionTrimmable] = useState(false);

  const goToTab = useTabNavigation();
  const altTitle = manga.attributes.altTitles.find(
    title => title.jp || title.en || title[manga.attributes.originalLanguage],
  );
  const description = preferredMangaDescription(manga)?.trim();
  const partialAuthorsAndArtists = authorsAndArtists.slice(0, 5);
  const showCredits = authorsAndArtists.length > 5;

  return (
    <ScrollView style={{padding: 5, flex: 1}}>
      <Title>{preferredMangaTitle(manga)}</Title>
      {altTitle && (
        <Caption style={{marginTop: -3}}>
          {altTitle[manga.attributes.originalLanguage] || altTitle.en}
        </Caption>
      )}
      {partialAuthorsAndArtists.length > 0 ? (
        <ChipsContainer
          data={partialAuthorsAndArtists}
          keyExtractor={item => item.id}
          style={{marginTop: 7, marginBottom: 13, marginHorizontal: -3}}
          itemStyle={{paddingHorizontal: 3, paddingVertical: 5}}
          additionalChip={
            showCredits
              ? {
                  content: 'See all artists',
                  icon: 'plus',
                  onAction: () => goToTab(2),
                }
              : undefined
          }
          renderChip={author => (
            <Chip
              avatar={
                <Avatar.Image
                  source={{uri: 'https://mangadex.org/avatar.png'}}
                  size={24}
                />
              }>
              {author.attributes.name || author.id}
            </Chip>
          )}
        />
      ) : null}
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
          {description ||
            `- No description was added for ${preferredMangaTitle(manga)} -`}
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
