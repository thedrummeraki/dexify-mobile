import React from 'react';
import {ScrollView} from 'react-native';
import {Title, Chip} from 'react-native-paper';
import {Author, Artist} from 'src/api/mangadex/types';
import {ChipsContainer} from 'src/components';

export default function ShowMangaDetailsCreditsTab({
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
        keyExtractor={author => author.id}
        style={{marginTop: 7, marginBottom: 13, marginHorizontal: -3}}
        itemStyle={{paddingHorizontal: 3, paddingVertical: 5}}
        renderChip={author => (
          <Chip icon="account">{author.attributes.name || author.id}</Chip>
        )}
      />
      <Title>Illustrated by</Title>
      <ChipsContainer
        data={artists}
        keyExtractor={artist => artist.id}
        style={{marginTop: 7, marginBottom: 13, marginHorizontal: -3}}
        itemStyle={{paddingHorizontal: 3, paddingVertical: 5}}
        renderChip={artist => (
          <Chip icon="palette">{artist.attributes.name || artist.id}</Chip>
        )}
      />
    </ScrollView>
  );
}
