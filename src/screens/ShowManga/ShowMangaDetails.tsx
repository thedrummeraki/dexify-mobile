import React, {useRef, useState} from 'react';
import {Image, ScrollView, TouchableNativeFeedback, View} from 'react-native';
import {
  Avatar,
  Button,
  Caption,
  Card,
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
import DynamicTabs, {DynamicTab} from 'src/components/DynamicTabs';
import ShowMangaChapterItem from './ShowMangaChapterItem';

interface Props {
  manga: Manga;
}

export default function ShowMangaDetails({manga}: Props) {
  const [showFullImage, setShowFullImage] = useState(false);
  const aspectRatio = showFullImage ? 1 : 2;

  const authors = findRelationships<Author>(manga, 'author');
  const artists = findRelationships<Artist>(manga, 'artist');

  const authorsAndArtistsObjects: Array<Author | Artist> = [];
  artists.forEach(artist => authorsAndArtistsObjects.push(artist));
  authors.forEach(author => authorsAndArtistsObjects.push(author));

  const authorsAndArtists = authorsAndArtistsObjects.filter(
    (value, index, self) => self.findIndex(v => v.id === value.id) === index,
  );

  const tabs: DynamicTab[] = [
    {
      title: 'Details',
      content: () => (
        <ShowMangaDetailsDetailsTab
          manga={manga}
          authorsAndArtists={authorsAndArtists}
        />
      ),
    },
    {
      title: 'Chapters',
      content: () => <ShowMangaDetailsChaptersTab manga={manga} />,
    },
    {
      title: 'Credits',
      content: () => (
        <ShowMangaDetailsCreditsTab authors={authors} artists={artists} />
      ),
    },
  ];

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

      <DynamicTabs tabs={tabs} />
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
        style={{marginHorizontal: -3, marginTop: 13}}
        itemStyle={{paddingHorizontal: 3, paddingVertical: 5}}
        renderChip={item => <Chip icon="tag">{item.attributes.name.en}</Chip>}
      />
    </ScrollView>
  );
}

function ShowMangaDetailsChaptersTab({manga}: {manga: Manga}) {
  const {data, loading} = useGetRequest<PagedResultsList<Chapter>>(
    `https://api.mangadex.org/manga/${manga.id}/feed?translatedLanguage[]=en&limit=10`,
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
  return (
    <ScrollView style={{flex: 1}}>
      <View>
        <View>
          <List.Section>
            {Object.entries(chapters).map(([number, list]) => (
              <ShowMangaChapterItem key={number} number={number} list={list} />
            ))}
          </List.Section>
        </View>
      </View>
    </ScrollView>
  );
}

function ShowMangaDetailsCreditsTab({
  authors,
  artists,
}: {
  authors: Author[];
  artists: Artist[];
}) {
  return (
    <ScrollView style={{padding: 5, flex: 1}}>
      <Title>Written by</Title>
      <ChipsContainer
        data={authors}
        style={{marginTop: 7, marginBottom: 13, marginHorizontal: -3}}
        itemStyle={{paddingHorizontal: 3, paddingVertical: 5}}
        renderChip={author => (
          <Chip icon={'account'}>{author.attributes.name || author.id}</Chip>
        )}
      />
      <Title>Illustrated by</Title>
      <ChipsContainer
        data={artists}
        style={{marginTop: 7, marginBottom: 13, marginHorizontal: -3}}
        itemStyle={{paddingHorizontal: 3, paddingVertical: 5}}
        renderChip={artist => (
          <Chip icon={'palette'}>{artist.attributes.name || artist.id}</Chip>
        )}
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
