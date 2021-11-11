import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Title} from 'react-native-paper';
import {findRelationship} from 'src/api';
import {Artist, Author, Manga} from 'src/api/mangadex/types';
import BasicList from 'src/components/BasicList';
import MangaThumbnail from 'src/components/MangaThumbnail';

interface Props {
  manga?: Manga[];
  author?: Author | Artist;
}

export default function ShowArtistDetails({manga, author}: Props) {
  const mangaAsArtist = manga?.filter(
    title => findRelationship<Artist>(title, 'artist')?.type === 'artist',
  );
  const mangaAsAuthor = manga?.filter(
    title => findRelationship<Author>(title, 'author')?.type === 'author',
  );

  console.log('as art', mangaAsArtist?.length);
  console.log('as auth', mangaAsAuthor?.length);

  return (
    <ScrollView style={{flex: 15}}>
      <Title style={{paddingHorizontal: 5}}>
        {author?.attributes.name}'s works
      </Title>

      <BasicList
        data={manga || []}
        aspectRatio={1 / 3}
        renderItem={item => <MangaThumbnail showReadingStatus manga={item} />}
      />
    </ScrollView>
  );
}
