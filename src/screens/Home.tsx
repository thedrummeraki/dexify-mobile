import React from 'react';
import {Text, View} from 'react-native';
import {DexifyHeader} from '../components';
import {useHeader} from '../prodivers';

import {useMangaList} from '../api/mangadex';
import {Manga, PagedResultsList} from '../api/mangadex/types';
import {useGetRequest} from '../api/utils';

export default function Home() {
  const {query} = useHeader({title: 'Dexify ~ Browse', showSearch: true});
  const {data, error, loading} = useGetRequest<PagedResultsList<Manga>>(
    'https://api.mangadex.org/manga?limit=j',
  );

  console.log(data, error, loading);

  if (loading) {
    return (
      <View>
        <Text>Loding...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>
          Uh-oh, {error.response?.data.result} error occured on mangadex
        </Text>
      </View>
    );
  }

  if (!data) {
    return null;
  }

  if (data.result === 'error') {
    return (
      <View>
        <Text>
          Uh-oh, something went wrong while fetching the info:{' '}
          {data.errors.map(error => error.detail).join(', ')}
        </Text>
      </View>
    );
  } else {
    return (
      <View>
        {data.data.map(item => (
          <Text>{JSON.stringify(item.attributes.title)}</Text>
        ))}
      </View>
    );
  }
}
