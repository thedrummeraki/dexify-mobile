import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {
  useLazyGetMangaList,
  useMangadexPagination,
} from 'src/api/mangadex/hooks';
import {Manga, MangaRequestParams} from 'src/api/mangadex/types';
import {MangaSearchCollection, MangaSearchFilters} from 'src/components';
import {
  ContentRatingFilter,
  PreviewFilters,
  TagsFilter,
} from 'src/components/MangaSearchFilters';
import MangaThumbnail from 'src/components/MangaThumbnail';
import {ThumbnailSkeleton} from 'src/foundation/Thumbnail';

interface Props {
  query: string;
}

export default function BrowseMangaResults({query}: Props) {
  // const [filters, setFilters] = useState<MangaRequestParams>({});

  // const {limit, offset, nextPage} = useMangadexPagination([query, filters]);

  // const [manga, setManga] = useState<Array<Manga>>([]);
  // const [hasMoreManga, setHasMoreManga] = useState(true);

  // const [searchManga, {data, loading}] = useLazyGetMangaList({
  //   order: {relevance: 'desc'},
  // });

  // const loadManga = (options: {
  //   offset: number;
  //   limit: number;
  //   title: string;
  //   filters: MangaRequestParams;
  // }) => {
  //   if (!hasMoreManga) {
  //     return;
  //   }

  //   return searchManga({
  //     title: options.title,
  //     limit: options.limit,
  //     offset: options.offset,
  //     ...options.filters,
  //   });
  // };

  // const numColumns = 3;

  // useEffect(() => {
  //   console.log('updating manga list', hasMoreManga);
  //   loadManga({offset, limit, title: query, filters});
  // }, [offset, limit, query, filters]);

  // // useEffect(() => {
  // //   searchManga({
  // //     title: query,
  // //     limit,
  // //     offset,
  // //     ...filters,
  // //   }).then(response => {
  // //     if (response?.result === 'ok') {
  // //       setHasMoreManga(response.total > offset);
  // //     }
  // //   });
  // // }, [loadManga]);

  // useEffect(() => {
  //   setManga([]);
  //   setHasMoreManga(true);
  // }, [query, filters]);

  // useEffect(() => {
  //   if (data?.result === 'ok') {
  //     setHasMoreManga(data.total > offset);
  //     setManga(currentManga => {
  //       console.log('setting state');
  //       const res = currentManga.concat(data.data);
  //       console.log('ok');
  //       return res;
  //     });
  //   }
  // }, [data]);

  // const skeletonMarkup =
  //   loading && hasMoreManga ? (
  //     <FlatList
  //       numColumns={numColumns}
  //       style={{marginBottom: 40}}
  //       contentContainerStyle={{padding: 2}}
  //       data={Array.from({length: limit}).map((_, i) => i)}
  //       renderItem={() => (
  //         <View style={{flex: 1 / numColumns, padding: 2}}>
  //           <ThumbnailSkeleton width="100%" height={170} />
  //         </View>
  //       )}
  //       keyExtractor={item => `skeleton-${item}`}
  //     />
  //   ) : undefined;

  return (
    <>
      {/* <MangaSearchFilters filters={filters} onFiltersChange={setFilters}>
        <MangaSearchFilters.Render mode="scroll">
          <PreviewFilters />
        </MangaSearchFilters.Render>
        <MangaSearchFilters.Render mode="modal">
          <ContentRatingFilter />
          <TagsFilter />
        </MangaSearchFilters.Render>
      </MangaSearchFilters>
      <FlatList
        data={manga}
        numColumns={numColumns}
        onEndReached={() => nextPage()}
        onEndReachedThreshold={1}
        style={{marginBottom: 40}}
        contentContainerStyle={{padding: 2}}
        ListFooterComponent={skeletonMarkup}
        renderItem={({item}) => {
          return (
            <View style={{flex: 1 / numColumns, padding: 2}}>
              <MangaThumbnail manga={item} />
            </View>
          );
        }}
      /> */}
      <MangaSearchCollection options={{title: query}} />
      {/* <List
        style={{padding: 5, paddingTop: 0}}
        loading={
          status === ResponseStatus.Initiated ||
          status === ResponseStatus.Pending
        }
        skeletonLength={15}
        ListEmptyComponent={
          <BrowseEmptyResults
            resourceType="manga"
            resourceTypePlural="manga"
            actionVerb="was"
            query={query}
          />
        }
        data={manga.map(manga => {
          const by =
            findRelationship<Author>(manga, 'author') ||
            findRelationship<Artist>(manga, 'artist');

          return {
            title: preferredMangaTitle(manga),
            subtitle: [manga.attributes.status, by?.attributes?.name]
              .filter(x => x)
              .join(' - '),
            image: {width: 70, url: mangaImage(manga)},
            onPress: () => navigation.push('ShowManga', manga),
          };
        })}
      /> */}
    </>
  );
}

function evenlyDistribute<T>(list: T[], numColumns: number): Array<T | null> {
  const remainder = list.length % numColumns;
  const result: Array<T | null> = list;
  if (remainder > 0) {
    const emptyItems: null[] = new Array(3 - remainder).fill(null);
    result.push(...emptyItems);
  }

  return result;
}
