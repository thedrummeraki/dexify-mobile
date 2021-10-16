import React, {useEffect, useState} from 'react';
import {FlatList, StyleProp, View, ViewProps} from 'react-native';
import {Caption, Text, Title, ActivityIndicator} from 'react-native-paper';
import {CoverSize, mangaImage} from 'src/api';
import {Author, Manga, PagedResultsList} from 'src/api/mangadex/types';
import {useLazyGetRequest} from 'src/api/utils';
import {Container} from 'src/components';
import BasicList from 'src/components/BasicList';
import CategoriesCollectionItem from 'src/components/CategoriesCollection/CategoriesCollectionItem';
import MangaCategoryItem from 'src/components/CategoriesCollection/MangaCategoryItem';
import Thumbnail from 'src/foundation/Thumbnail';
import {useScreenOrientation} from 'src/utils';

interface Props {
  query: string;
  onLoading: (loading: boolean) => void;
  style?: StyleProp<ViewProps>;
}

export default function BrowseResults({query, onLoading}: Props) {
  const orientation = useScreenOrientation();
  const [results, setResults] = useState<Manga[]>([]);
  const [authorIds, setAuthorIds] = useState<string[]>([]);
  const [getMangas, {data, loading, error}] =
    useLazyGetRequest<PagedResultsList<Manga>>();
  const [getAuthors, {data: authorsData}] =
    useLazyGetRequest<PagedResultsList<Author>>();

  useEffect(() => onLoading(loading), [loading]);
  useEffect(() => {
    if (data?.result === 'ok') {
      setResults(data.data);
    }
  }, [data]);
  useEffect(() => {
    if (authorsData?.result === 'ok') {
      setAuthorIds(authorsData.data.map(author => author.id));
    }
  }, [authorsData]);

  useEffect(() => {
    getMangas(
      `https://api.mangadex.org/manga?title=${query}&includes[]=cover_art&order[followedCount]=desc&limit=100`,
    );
    getAuthors(`https://api.mangadex.org/author?name=${query}&limit=100`);
  }, [query]);

  if (data?.result === 'error' || (!data && error)) {
    return <Title>Error while searching for "{query}"</Title>;
  }

  const totalResultsCount = !loading && data && `(${data.total})`;

  return (
    <View>
      <CategoriesCollectionItem
        category={{title: 'Authors', type: 'author', ids: authorIds}}
      />
      <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 20}}>
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
      <BasicList
        data={results}
        aspectRatio={orientation === 'portrait' ? 1 / 3 : 0.25}
        renderItem={manga => (
          <Thumbnail
            imageUrl={mangaImage(manga, {size: CoverSize.Small}) || '/'}
            title={manga.attributes.title.en}
            width="100%"
            aspectRatio={0.8}
          />
        )}
      />
    </View>
  );
}
