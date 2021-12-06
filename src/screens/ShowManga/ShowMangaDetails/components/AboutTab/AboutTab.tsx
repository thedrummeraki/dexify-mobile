import React, {useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {
  Appbar,
  Button,
  Caption,
  Chip,
  IconButton,
  Paragraph,
  Text,
  Title,
  useTheme,
} from 'react-native-paper';
import {
  contentRatingInfo,
  CoverSize,
  findRelationships,
  mangaImage,
  preferredMangaDescription,
  preferredMangaTitle,
  preferredTitle,
  readingStatusInfo,
} from 'src/api';
import {Artist, Author, ContentRating} from 'src/api/mangadex/types';
import {ImageGradient, TextBadge} from 'src/components';
import {
  PaperProviderForBackground,
  useBackgroundColor,
  useTextColor,
} from 'src/components/colors';
import MangaThumbnail from 'src/components/MangaThumbnail';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail from 'src/foundation/Thumbnail';
import {useIsLoggedIn, useLibraryStatus, useSession} from 'src/prodivers';
import TopManga from 'src/screens/NewHome/Feed/Section/components/TopManga';
import {useMangaDetails} from '../../ShowMangaDetails';
import ChaptersTab from '../ChaptersTab';
import ChaptersList from './ChaptersList';
import FollowMangaButton from './FollowMangaButton';
import StartReadingButton from './StartReadingButton';

export default function AboutTab() {
  const navigation = useDexifyNavigation();
  const isLoggedIn = useIsLoggedIn();
  const {manga, aggregate, coverUrl} = useMangaDetails();
  const libraryStatus = useLibraryStatus(manga);
  const readingStatus = readingStatusInfo(libraryStatus);
  const readingStatusBackgroundColor = useBackgroundColor(
    readingStatus.background,
  );

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

  const contentRating = manga.attributes.contentRating
    ? contentRatingInfo(manga.attributes.contentRating)
    : undefined;

  const contentRatingTextColor = useBackgroundColor(contentRating?.background);

  const aggregateEntries = Object.entries(aggregate || {});
  const volumes = aggregateEntries.map(([volume, _]) => volume);
  const volumesCountText =
    volumes.length === 1 ? '1 volume' : `${volumes.length} volumes`;

  const basicInfoMarkup = (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          marginTop: 10,
        }}>
        {contentRating && (
          <TextBadge
            content={contentRating.content}
            icon={contentRating.icon}
            textStyle={{color: contentRatingTextColor}}
          />
        )}
        {manga.attributes.publicationDemographic && (
          <TextBadge
            content={manga.attributes.publicationDemographic}
            background="disabled"
          />
        )}
        {aggregate && volumes.length > 0 && (
          <TextBadge content={volumesCountText} background="notification" />
        )}
        {manga.attributes.year && <TextBadge content={manga.attributes.year} />}
      </View>
    </View>
  );

  const chaptersListHeaderMarkup = (
    <>
      <TopManga
        description={altTitle ? preferredTitle(altTitle) : undefined}
        manga={manga}
        aspectRatio={1.2}
        FooterComponent={basicInfoMarkup}
      />
      <PaperProviderForBackground background={readingStatus.background}>
        <View
          style={{
            marginTop: -15,
            marginHorizontal: 15,
            flexDirection: 'row',
          }}>
          <Chip
            disabled={!isLoggedIn}
            icon={readingStatus.icon}
            style={{backgroundColor: readingStatusBackgroundColor}}
            onPress={isLoggedIn ? () => {} : undefined}>
            {readingStatus.phrase}
          </Chip>
        </View>
      </PaperProviderForBackground>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          marginTop: 10,
          paddingHorizontal: 15,
        }}>
        <Text style={{marginRight: 6}}>Made by:</Text>
        {authorsAndArtists.map(artist => (
          <TextBadge
            key={artist.id}
            content={artist.attributes.name}
            background="surface"
            onPress={() =>
              navigation.push('ShowArtist', {
                id: artist.id,
                allowHentai:
                  manga.attributes.contentRating === ContentRating.pornographic,
              })
            }
          />
        ))}
      </View>
      <View style={{display: 'flex', marginTop: 15, marginBottom: -10}}>
        <FollowMangaButton />
        <Button
          mode="outlined"
          icon="plus"
          style={{marginTop: 5}}
          onPress={() => navigation.push('AddToPlaylist', {manga})}>
          Add to list...
        </Button>
      </View>
    </>
  );

  const chaptersListFooterMarkup = (
    <>
      <View style={{padding: 15}}>
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
                No description was added for {preferredMangaTitle(manga)}
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
        {/* <View
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
          </View> */}
      </View>
    </>
  );

  return (
    <>
      <View
        style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
        <StartReadingButton icon="play" />
      </View>
      <ChaptersList
        ListHeaderComponent={chaptersListHeaderMarkup}
        ListFooterComponent={chaptersListFooterMarkup}
      />
    </>
  );
}
