import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {DexifyHeader} from '../components';
import {useHeader} from '../prodivers';

import {useMangaList} from '../api/mangadex';
import {Manga, PagedResultsList} from '../api/mangadex/types';
import {useGetRequest} from '../api/utils';
import {Container} from '../components';

export default function Home() {
  const {query} = useHeader({title: 'Dexify ~ Browse', showSearch: true});
  const {data, error, loading} = useGetRequest<PagedResultsList<Manga>>(
    'https://api.mangadex.org/manga',
  );

  if (loading) {
    return (
      <Container>
        <Text>Loding...</Text>
      </Container>
    );
  }

  if (error) {
    const details =
      error.response?.data.result === 'error' &&
      error.response?.data.errors.map(error => error.detail).join(', ');
    return (
      <Container>
        <Text>Uh-oh, {details} error occured on mangadex</Text>
      </Container>
    );
  }

  if (!data) {
    return null;
  }

  if (data.result === 'error') {
    return (
      <Container>
        <Text>
          Uh-oh, something went wrong while fetching the info:{' '}
          {data.errors.map(error => error.detail).join(', ')}
        </Text>
      </Container>
    );
  } else {
    return (
      <View>
        <FlatList
          data={data.data}
          renderItem={({item}) => <Text>{item.attributes.status}</Text>}
        />
      </View>
    );
  }
}
