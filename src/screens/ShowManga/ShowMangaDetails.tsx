import React, {useState} from 'react';
import {Image, ScrollView, TouchableNativeFeedback, View} from 'react-native';
import {
  Button,
  Caption,
  Chip,
  List,
  Paragraph,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';
import {
  Tabs,
  TabScreen,
  useTabIndex,
  useTabNavigation,
} from 'react-native-paper-tabs';
import {
  CoverSize,
  findRelationships,
  mangaImage,
  preferredMangaDescription,
  preferredMangaTitle,
} from 'src/api';
import {
  Artist,
  Author,
  Chapter,
  Manga,
  PagedResultsList,
} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {ChipsContainer} from 'src/components';
import ShowMangaChapterItem from './ShowMangaChapterItem';

interface Props {
  manga: Manga;
}

export default function ShowMangaDetails({manga}: Props) {
  const [showFullImage, setShowFullImage] = useState(false);
  const aspectRatio = showFullImage ? 1 : 2;

  const {data, loading} = useGetRequest<PagedResultsList<Chapter>>(
    `https://api.mangadex.org/manga/${manga.id}/feed?translatedLanguage[]=en`,
  );

  const chapters: {[key: string]: Chapter[]} = {};
  if (data?.result === 'ok') {
    for (const chapter of data.data) {
      const key = chapter.attributes.chapter || 'N/A';
      if (chapters[key]) {
        chapters[key].push(chapter);
      } else {
        chapters[key] = [chapter];
      }
    }
  }

  const authors = findRelationships<Author>(manga, 'author');
  const artists = findRelationships<Artist>(manga, 'artist');

  const authorsAndArtistsObjects: Array<Author | Artist> = [];
  artists.forEach(artist => authorsAndArtistsObjects.push(artist));
  authors.forEach(author => authorsAndArtistsObjects.push(author));

  const authorsAndArtists = authorsAndArtistsObjects.filter(
    (value, index, self) => self.findIndex(v => v.id === value.id) === index,
  );

  const showCredits = authorsAndArtists.length > 5;

  return (
    <View style={{height: '100%'}}>
      <TouchableNativeFeedback
        useForeground
        onPress={() => setShowFullImage(!showFullImage)}
        background={TouchableNativeFeedback.Ripple('#fff', false)}>
        <View>
          <Image
            source={{uri: mangaImage(manga, {size: CoverSize.Original})}}
            style={{width: '100%', aspectRatio}}
          />
        </View>
      </TouchableNativeFeedback>

      <Tabs mode="scrollable" showLeadingSpace={false}>
        <TabScreen label="Details">
          <ShowMangaDetailsDetailsTab
            manga={manga}
            authorsAndArtists={authorsAndArtists}
          />
        </TabScreen>
        <TabScreen
          label={
            loading
              ? 'Loading...'
              : data?.result === 'ok'
              ? `Chapters (${data.total})`
              : 'Chapters (X)'
          }>
          <ScrollView style={{flex: 1}}>
            <View>
              <View>
                <List.Section
                  title={`Chapters (${
                    (data?.result === 'ok' && data.total) || '...'
                  })`}>
                  {Object.entries(chapters).map(([number, list]) => (
                    <ShowMangaChapterItem
                      key={number}
                      number={number}
                      list={list}
                    />
                  ))}
                </List.Section>
              </View>
            </View>
          </ScrollView>
        </TabScreen>
        <TabScreen label="Credits">
          <ScrollView style={{padding: 5, flex: 1}}>
            <Title>Written by</Title>
            <ChipsContainer
              data={authors}
              style={{marginTop: 7, marginBottom: 13, marginHorizontal: -3}}
              itemStyle={{paddingHorizontal: 3, paddingVertical: 5}}
              renderChip={author => (
                <Chip icon={'account'}>
                  {author.attributes.name || author.id}
                </Chip>
              )}
            />
            <Title>Illustrated by</Title>
            <ChipsContainer
              data={artists}
              style={{marginTop: 7, marginBottom: 13, marginHorizontal: -3}}
              itemStyle={{paddingHorizontal: 3, paddingVertical: 5}}
              renderChip={artist => (
                <Chip icon={'palette'}>
                  {artist.attributes.name || artist.id}
                </Chip>
              )}
            />
          </ScrollView>
        </TabScreen>
      </Tabs>
    </View>
  );
}

function ShowMangaDetailsDetailsTab({
  manga,
  authorsAndArtists,
}: {
  manga: Manga;
  authorsAndArtists: Array<Author | Artist>;
}) {
  const goToTab = useTabNavigation();
  const altTitle = manga.attributes.altTitles.find(
    title => title[manga.attributes.originalLanguage] || title.en,
  );
  const description = preferredMangaDescription(manga);
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
            <Chip icon={author.type === 'artist' ? 'account' : 'palette'}>
              {author.attributes.name || author.id}
            </Chip>
          )}
        />
      ) : null}
      {description && <Paragraph>{description}</Paragraph>}
      <ChipsContainer
        data={manga.attributes.tags}
        style={{marginHorizontal: -3}}
        itemStyle={{paddingHorizontal: 3, paddingVertical: 5}}
        renderChip={item => <Chip icon="tag">{item.attributes.name.en}</Chip>}
      />
    </ScrollView>
  );
}

function ExploreWitHookExamples() {
  const goTo = useTabNavigation();
  const index = useTabIndex();
  return (
    <View style={{flex: 1}}>
      <Title>Explore</Title>
      <Paragraph>Index: {index}</Paragraph>
      <Button onPress={() => goTo(1)}>Go to Flights</Button>
    </View>
  );
}
