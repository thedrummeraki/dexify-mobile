import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, ScrollView, StyleProp, View, ViewStyle} from 'react-native';
import {Title, ActivityIndicator} from 'react-native-paper';
import {CoverSize, mangaImage, preferredMangaTitle} from 'src/api';
import {Author, Manga, PagedResultsList} from 'src/api/mangadex/types';
import {useLazyGetRequest} from 'src/api/utils';
import BasicList from 'src/components/BasicList';
import CategoriesCollectionItem from 'src/components/CategoriesCollection/CategoriesCollectionItem';
import {useDexifyNavigation} from 'src/foundation/Navigation';
import Thumbnail from 'src/foundation/Thumbnail';
import {useScreenOrientation} from 'src/utils';

interface Props {
  query: string;
  style?: StyleProp<ViewStyle>;
}

export default function BrowseResults({query}: Props) {
  const orientation = useScreenOrientation();
  const navigation = useDexifyNavigation();
  const endReachedRef = useRef(false);

  const [results, setResults] = useState<Manga[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMoreManga, setHasMoreManga] = useState(false);
  const [authorIds, setAuthorIds] = useState<string[]>([]);
  const [getMangas, {data, loading, error}] =
    useLazyGetRequest<PagedResultsList<Manga>>();
  const [getAuthors, {data: authorsData}] =
    useLazyGetRequest<PagedResultsList<Author>>();

  useEffect(() => Keyboard.dismiss(), [loading]);

  useEffect(() => {
    if (data?.result === 'ok') {
      setResults(results => results.concat(data.data));
    }
  }, [data]);
  useEffect(() => {
    if (data?.result === 'ok') {
      setHasMoreManga(data.total > results.length);
    }
  }, [data, results]);
  useEffect(
    () => setResults(data?.result === 'ok' ? data.data : []),
    [data, query],
  );
  useEffect(() => {
    if (authorsData?.result === 'ok') {
      setAuthorIds(authorsData.data.map(author => author.id));
    }
  }, [authorsData]);

  useEffect(() => {
    getMangas(
      `https://api.mangadex.org/manga?title=${query}&includes[]=cover_art&order[followedCount]=desc&limit=100&offset=${offset}`,
    );
  }, [query, offset]);
  useEffect(() => {
    getAuthors(`https://api.mangadex.org/author?name=${query}&limit=100`);
  }, [query]);

  if (data?.result === 'error' || (!data && error)) {
    return <Title>Error while searching for "{query}"</Title>;
  }

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 200;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <View>
      <View style={{marginBottom: 10}}>
        <CategoriesCollectionItem category={{type: 'author', ids: authorIds}} />
      </View>
      <ScrollView
        onScroll={({nativeEvent}) => {
          if (!endReachedRef.current && isCloseToBottom(nativeEvent)) {
            endReachedRef.current = true;
            if (hasMoreManga) {
              setOffset(offset => offset + 100);
            }
          } else if (endReachedRef.current && !isCloseToBottom(nativeEvent)) {
            endReachedRef.current = false;
          }
        }}>
        <View>
          <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 20}}>
            {loading && (
              <ActivityIndicator
                size="small"
                style={{flexShrink: 1, marginRight: 5}}
              />
            )}
          </View>
          <BasicList
            data={results}
            aspectRatio={orientation === 'portrait' ? 1 / 3 : 0.25}
            renderItem={manga => (
              <Thumbnail
                imageUrl={mangaImage(manga, {size: CoverSize.Small}) || '/'}
                title={preferredMangaTitle(manga)}
                width="100%"
                aspectRatio={0.8}
                onPress={() => navigation.navigate('ShowManga', {id: manga.id})}
              />
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}
