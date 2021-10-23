import React, {useState} from 'react';
import {Image, TouchableNativeFeedback, View} from 'react-native';
import {CoverSize, findRelationships, mangaImage} from 'src/api';
import {Artist, Author, Manga} from 'src/api/mangadex/types';
import DynamicTabs, {DynamicTab} from 'src/components/DynamicTabs';
import {AboutTab, ChaptersTab, AnimeDetailsTab, DetailsTab} from './components';
import GalleryTab from './components/GalleryTab';

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
      title: 'About',
      content: () => (
        <AboutTab manga={manga} authorsAndArtists={authorsAndArtists} />
      ),
    },
    {
      title: 'Read',
      content: () => <ChaptersTab manga={manga} />,
    },
    {
      title: 'Anime',
      content: () => <AnimeDetailsTab manga={manga} />,
    },
    {
      title: 'Details',
      content: () => <DetailsTab manga={manga} />,
    },
    {
      title: 'Gallery',
      content: () => <GalleryTab manga={manga} />,
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

      <DynamicTabs tabs={tabs} mode="scrollable" showLeadingSpace={false} />
    </View>
  );
}
