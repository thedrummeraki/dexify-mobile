import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Title} from 'react-native-paper';
import {Artist, Author, ContentRating} from 'src/api/mangadex/types';
import {MangaSearchCollection} from 'src/components';
import {useShowArtistRoute} from 'src/foundation';

interface Props {
  author: Author | Artist;
}

export default function ShowArtistDetails({author}: Props) {
  const {
    params: {allowHentai},
  } = useShowArtistRoute();

  const contentRating = [
    ContentRating.safe,
    ContentRating.suggestive,
    ContentRating.erotica,
  ];
  if (allowHentai) {
    contentRating.push(ContentRating.pornographic);
  }

  return (
    <ScrollView style={{flex: 1}}>
      <Title style={{paddingHorizontal: 15}}>
        {author.attributes.name}'s works
      </Title>

      <MangaSearchCollection
        options={{
          artists: [author.id],
          contentRating,
          order: {followedCount: 'desc'},
        }}
      />
    </ScrollView>
  );
}
