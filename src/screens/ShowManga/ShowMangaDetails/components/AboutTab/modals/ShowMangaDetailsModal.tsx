import React, {useState} from 'react';
import {Image, Linking, ScrollView, StyleSheet, View} from 'react-native';
import {Card, Chip, Text, useTheme} from 'react-native-paper';
import {
  contentRatingInfo,
  findRelationships,
  preferredMangaDescription,
  preferredMangaTitle,
  preferredTitle,
} from 'src/api';
import {
  Author,
  Artist,
  ContentRating,
  MangaLinkKey,
  MangaLinks,
} from 'src/api/mangadex/types';
import {Banner, FullScreenModal, TextBadge} from 'src/components';
import Markdown, {
  AstRenderer,
  MarkdownIt,
  RenderRules,
  renderRules,
} from 'react-native-markdown-display';
import {useMangaDetails} from '../../../ShowMangaDetails';
import {useBackgroundColor} from 'src/components/colors';
import {useDexifyNavigation} from 'src/foundation';
import {capitalize, onlyUnique, useDimensions} from 'src/utils';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';

interface Props {
  visible: boolean;
  onDismiss(): void;
}

interface MangaLinkButtonProps {
  linkKey: MangaLinkKey;
  url: string;
}

interface MapInfo {
  background: string;
  color: string;
  name: string;
  transform?: (value: string) => string;
}

type MangaLinkInfoMap = {
  [key in MangaLinkKey]: MapInfo;
};

export default function ShowMangaDetailsModal({visible, onDismiss}: Props) {
  const {manga} = useMangaDetails();

  return (
    <FullScreenModal
      visible={visible}
      title={preferredMangaTitle(manga)}
      onDismiss={onDismiss}>
      <ModalChildren onDismiss={onDismiss} />
    </FullScreenModal>
  );
}

function ModalChildren({onDismiss}: Pick<Props, 'onDismiss'>) {
  const theme = useTheme();
  const navigation = useDexifyNavigation();
  const {width} = useDimensions();
  const {manga, isAiring, statistics} = useMangaDetails();

  const contentRating = contentRatingInfo(manga.attributes.contentRating);
  const contentRatingTextColor = useBackgroundColor(contentRating?.background);

  const authors = findRelationships<Author>(manga, 'author');
  const artists = findRelationships<Artist>(manga, 'artist');
  const authorsAndArtistsObjects: Array<Author | Artist> = [];
  authors.forEach(author => authorsAndArtistsObjects.push(author));
  artists.forEach(artist => authorsAndArtistsObjects.push(artist));
  const authorsAndArtists = authorsAndArtistsObjects.filter(
    (value, index, self) => self.findIndex(v => v.id === value.id) === index,
  );

  const rules: RenderRules = {
    text: node => {
      return <Text key={node.key}>{node.content}</Text>;
    },
    link: node => {
      if (node.children.length <= 0) {
        return null;
      }

      return (
        <View key={node.key}>
          {node.children.map(child => {
            return (
              <TextBadge
                key={child.key}
                style={{marginVertical: -3, marginRight: 0}}
                textStyle={{textDecorationLine: 'underline'}}
                content={child.content}
                background="background"
                onPress={() => {
                  if (node.attributes.href) {
                    Linking.openURL(node.attributes.href);
                  }
                }}
              />
            );
          })}
        </View>
      );
    },
    hr: (node, _children, _parent, styles) => (
      <View
        key={node.key}
        style={{...styles._VIEW_SAFE_hr, backgroundColor: theme.colors.text}}
      />
    ),
    image: () => null, // disable images for now
  };

  console.log(statistics);

  return (
    <ScrollView>
      <Banner visible={false} title="Watch out for spoilers~!">
        No everyone likes spoilers, so we thought we'd let you know. Some
        descriptions may contain{' '}
        <Text
          style={{
            textDecorationLine: 'line-through',
            textDecorationStyle: 'solid',
          }}>
          evil
        </Text>{' '}
        spoilers!
      </Banner>
      <View style={{paddingHorizontal: 15}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
          }}>
          <TextBadge content={manga.attributes.status} />
          <TextBadge
            content={contentRating.content}
            icon={contentRating.icon}
            textStyle={{color: contentRatingTextColor}}
          />
          {manga.attributes.publicationDemographic ? (
            <TextBadge
              content={capitalize(manga.attributes.publicationDemographic)}
            />
          ) : null}
          {statistics && (
            <>
              <TextBadge
                icon="star"
                content={statistics.rating.average.toFixed(2)}
              />
              <TextBadge
                icon="bookmark-check"
                content={statistics.follows || 'N/A'}
              />
            </>
          )}
          {isAiring && (
            <TextBadge
              content="Anime airing"
              icon="video"
              background="primary"
              style={{borderRadius: 10}}
            />
          )}
          {manga.attributes.year && (
            <TextBadge content={manga.attributes.year} />
          )}
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
              icon={artist.type === 'artist' ? 'palette' : 'account'}
              content={artist.attributes.name}
              background="surface"
              onPress={() => {
                onDismiss();
                navigation.push('ShowArtist', {
                  id: artist.id,
                  allowHentai:
                    manga.attributes.contentRating ===
                    ContentRating.pornographic,
                });
              }}
            />
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginBottom: 15,
          }}>
          <Text style={{marginRight: 6}}>Original language:</Text>
          <TextBadge
            content={manga.attributes.originalLanguage.toLocaleUpperCase()}
          />
        </View>
        <Markdown
          rules={rules}
          mergeStyle
          style={StyleSheet.create({
            image: {
              width,
            },
          })}>
          {preferredMangaDescription(manga)}
        </Markdown>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginTop: 30,
          }}>
          <Text style={{marginRight: 6}}>Genres:</Text>
          {manga.attributes.tags.map(tag => (
            <TextBadge
              key={tag.id}
              background="disabled"
              content={tag.attributes.name.en}
              onPress={() => navigation.push('ShowMangaByTags', {tags: [tag]})}
            />
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginTop: 30,
          }}>
          <Text style={{marginRight: 6}}>Also known as:</Text>
          {manga.attributes.altTitles
            .map(altTitle => preferredTitle(altTitle))
            .filter(onlyUnique)
            .map(title => (
              <TextBadge key={title} content={title} background="surface" />
            ))}
        </View>
        <View style={{marginHorizontal: -15, marginTop: 20}}>
          <MangaExternalLinks />
        </View>
      </View>
    </ScrollView>
  );
}

function RelatedManga() {}

function MangaExternalLinks() {
  const {manga} = useMangaDetails();

  const links = manga.attributes.links
    ? Object.entries(manga.attributes.links)
        .map(entry => {
          const linkKey = entry[0] as MangaLinkKey;
          const url = entry[1];

          return url ? {linkKey, url} : null;
        })
        .filter(x => x)
    : [];

  if (links.length) {
    return (
      <CategoriesCollectionSection
        title={`External links (${links.length})`}
        data={links}
        renderItem={link => {
          if (!link) {
            return null;
          }
          const {linkKey, url} = link;
          if (
            !Object.entries(mangaLinkInfoMap)
              .map(entry => entry[0])
              .includes(linkKey)
          ) {
            console.log('Undocumented link', linkKey, url);
            return <Chip>???</Chip>;
          }

          const {name, transform} = mangaLinkInfoMap[linkKey];
          const finalUrl = transform ? transform(url) : url;

          return <Chip onPress={() => Linking.openURL(finalUrl)}>{name}</Chip>;
        }}
      />
    );
  }
  return null;
}

const mangaLinkInfoMap: MangaLinkInfoMap = {
  al: {
    // background: "#2b2d42",
    // color: "#d9e6ff",
    background: '',
    color: '',
    name: 'AniList',
    transform: id => `https://anilist.co/manga/${id}`,
  },
  amz: {background: '', color: '', name: 'Amazon'},
  ap: {
    background: '',
    color: '',
    name: 'AnimePlanet',
    transform: slug => `https://www.anime-planet.com/manga/${slug}`,
  },
  bw: {
    background: '',
    color: '',
    name: 'bookwalker.jp',
    transform: slug => `https://bookwalker.jp/${slug}`,
  },
  cdj: {background: '', color: '', name: 'CDJapan'}, // Not documented for now
  ebj: {background: '', color: '', name: 'eBook Japan'},
  engtl: {background: '', color: '', name: 'Official English'},
  kt: {
    background: '',
    color: '',
    name: 'Kitsu.io',
    transform: idOrSlug => {
      if (parseInt(idOrSlug)) {
        return `https://kitsu.io/manga/${idOrSlug}`;
      } else {
        return `https://kitsu.io/api/edge/manga?filter[slug]=${idOrSlug}`;
      }
    },
  },
  mal: {
    background: '',
    color: '',
    name: 'MyAnimeList',
    transform: id => `https://myanimelist.net/manga/${id}`,
  },
  mu: {
    background: '',
    color: '',
    name: 'Baka-Updates Manga',
    transform: id => `https://www.mangaupdates.com/series.html?id=${id}`,
  },
  nu: {
    background: '',
    color: '',
    name: 'Novel Updates',
    transform: slug => `https://www.novelupdates.com/series/${slug}`,
  },
  raw: {background: '', color: '', name: 'Official (original)'},
};
