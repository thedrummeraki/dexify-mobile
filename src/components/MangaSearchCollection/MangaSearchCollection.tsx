import {mergeDeep} from '@apollo/client/utilities';
import React, {ComponentProps, useEffect, useRef, useState} from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {
  useLazyGetMangaList,
  useMangadexPagination,
} from 'src/api/mangadex/hooks';
import {Manga, MangaRequestParams} from 'src/api/mangadex/types';
import {useContentRatingFitlers} from 'src/prodivers';
import {useDebouncedValue} from 'src/utils';
import Banner from '../Banner';
import MangaCollection from '../MangaCollection';
import MangaSearchFilters, {
  RenderContext,
  ContentRatingFilter,
  PublicationStatusFitler,
  PublicationDemographicFilter,
  TagsFilter,
  PreviewFilters,
} from '../MangaSearchFilters';

export enum MangaCollectionDisplay {
  List,
  Images,
}

interface FilterOptions {
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  vertical?: boolean;
}

type Props = {
  searchingById?: boolean;
  hideSearchFilters?: boolean;
  options?: MangaRequestParams;
  showEverything?: boolean;
  timeout?: number;
  filterOptions?: FilterOptions;
  onMangaReady?(manga: Manga[]): void;
} & ComponentProps<typeof MangaCollection>;

export default function MangaSearchCollection({
  options,
  showEverything,
  searchingById,
  hideSearchFilters,
  timeout,
  onMangaReady,
  ...otherProps
}: Props) {
  const [get, {loading, data}] = useLazyGetMangaList(options, showEverything);

  const contentRatings = useContentRatingFitlers();
  const [manga, setManga] = useState<Array<Manga>>([]);
  const [hasMoreManga, setHasMoreManga] = useState(
    // searchingById && (options?.ids?.length || 0) > limit,
    true,
  );
  const searchStarted = useRef(false);

  const [filters, setFilters] = useState<MangaRequestParams>({
    contentRating: contentRatings,
  });
  const {limit, offset, nextOffset, nextPage, resetPage} =
    useMangadexPagination([options, filters]);

  const canSearchForManga =
    (searchingById && (options?.ids?.length || 0) > 0) || !searchingById;

  const debouncedOptions = useDebouncedValue(options, timeout);

  const searchManga = (
    searchFilters: MangaRequestParams,
    searchLimit: number,
    searchOffset: number,
    searchOptions?: MangaRequestParams,
  ) => {
    if (!hasMoreManga && searchStarted.current) {
      return;
    }

    if (searchingById && !Object.values(options?.ids || []).length) {
      return;
    }

    searchStarted.current = true;
    console.log('searching by', {
      searchOffset,
      searchLimit,
      ...searchOptions,
      ...searchFilters,
    });
    get({
      offset: searchOffset,
      limit: searchLimit,
      ...searchOptions,
      ...searchFilters,
    });
  };

  useEffect(() => {
    console.log(`useEffect[limit=${limit} offset=${offset}]`);
    console.log('offset', offset, 'vs options', options);
    searchManga(filters, limit, offset, options);
  }, [debouncedOptions, filters, limit, offset]);

  useEffect(() => {
    console.log('useEffect[options filters]');
    setHasMoreManga(true);
    setManga([]);
  }, [options, filters]);

  // useEffect(() => {
  //   console.log('useEffect[manga]');
  //   if (manga.length) {
  //     onMangaReady?.(manga);
  //   }
  // }, [manga]);

  useEffect(() => {
    console.log('useEffect[data]');
    if (data?.result === 'ok') {
      console.log('total', data.total);
      setHasMoreManga(data.total > nextOffset);
      setManga(current => current.concat(data.data));
    }
  }, [data]);

  const seachFiltersMarkup = !hideSearchFilters ? (
    <MangaSearchFilters filters={filters} onFiltersChange={setFilters}>
      <RenderContext mode="modal">
        <ContentRatingFilter visibleContentRatings={contentRatings} />
        <PublicationStatusFitler />
        <PublicationDemographicFilter />
        <TagsFilter />
      </RenderContext>
      <RenderContext mode="scroll">
        <PreviewFilters />
      </RenderContext>
    </MangaSearchFilters>
  ) : null;

  const mangaListMarkup = (
    <MangaCollection
      hasMoreManga={hasMoreManga}
      loading={loading && canSearchForManga}
      manga={manga}
      {...otherProps}
      flatListProps={{
        ListEmptyComponent:
          canSearchForManga && loading ? null : (
            <Banner children="No manga titles added." />
          ),
        onEndReached: () => {
          if (searchStarted.current && !loading && hasMoreManga) {
            nextPage();
          }
        },
      }}
    />
  );

  return (
    <>
      {seachFiltersMarkup}
      {mangaListMarkup}
    </>
  );
}
