import React, {useEffect, useState} from 'react';
import {FlatList, StyleProp, View, ViewProps} from 'react-native';
import {Caption, Text, Title, ActivityIndicator} from 'react-native-paper';
import {CoverSize, mangaImage} from 'src/api';
import {Manga, PagedResultsList} from 'src/api/mangadex/types';
import {useLazyGetRequest} from 'src/api/utils';
import {Container} from 'src/components';
import MangaCategoryItem from 'src/components/CategoriesCollection/MangaCategoryItem';
import Thumbnail from 'src/foundation/Thumbnail';

interface Props {
  query: string;
  onLoading: (loading: boolean) => void;
  style?: StyleProp<ViewProps>;
}

export default function BrowseResults({query, onLoading}: Props) {
  const [results, setResults] = useState<Manga[]>([]);
  const [get, {data, loading, error}] =
    useLazyGetRequest<PagedResultsList<Manga>>();

  useEffect(() => onLoading(loading), [loading]);
  useEffect(() => {
    if (data?.result === 'ok') {
      setResults(data.data);
    }
  }, [data]);

  useEffect(() => {
    const searchUrl = `https://api.mangadex.org/manga?title=${query}&includes[]=cover_art&order[followedCount]=desc&limit=100`;
    get(searchUrl);
  }, [query]);

  if (data?.result === 'error' || (!data && error)) {
    return <Title>Error while searching for "{query}"</Title>;
  }

  const totalResultsCount = !loading && data && `(${data.total})`;

  return (
    <View>
      <View style={{flex: 1, flexDirection: 'row', padding: 5}}>
        {loading && (
          <ActivityIndicator
            size="small"
            style={{flexShrink: 1, marginRight: 5}}
          />
        )}
        <Title style={{flexGrow: 1}}>
          Search results for "{query}" {totalResultsCount}
        </Title>
      </View>
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        {results.map(manga => (
          <View
            key={manga.id}
            style={{
              flexBasis: (data?.total || 0) > 10 ? '33.333333333%' : '50%',
              padding: 5,
            }}>
            <Thumbnail
              imageUrl={mangaImage(manga, {size: CoverSize.Small}) || '/'}
              title={manga.attributes.title.en}
              width={'100%'}
              aspectRatio={0.9}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
