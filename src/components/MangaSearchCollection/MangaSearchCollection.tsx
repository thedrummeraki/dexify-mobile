/* eslint-disable react-hooks/exhaustive-deps */
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
  const {limit, offset, nextOffset, nextPage} = useMangadexPagination([
    options,
    filters,
  ]);

  const canSearchForManga =
    (searchingById && (options?.ids?.length || 0) > 0) || !searchingById;

  const debouncedOptions = useDebouncedValue(options, timeout);

  const searchManga = (
    searchFilters: MangaRequestParams,
    searchLimit: number,
    searchOffset: number,
    hasMoreManga: boolean,
    searchOptions?: MangaRequestParams,
  ) => {
    if (!hasMoreManga && searchStarted.current) {
      return;
    }

    if (searchingById && !Object.values(options?.ids || []).length) {
      return;
    }

    searchStarted.current = true;
    get({
      offset: searchOffset,
      limit: searchLimit,
      ...searchOptions,
      ...searchFilters,
    });
  };

  useEffect(() => {
    searchManga(filters, limit, offset, hasMoreManga, debouncedOptions);
  }, [debouncedOptions, filters, limit, offset, hasMoreManga]);

  useEffect(() => {
    console.log({filters});
    setHasMoreManga(true);
    setManga([]);
  }, [options, filters]);

  useEffect(() => {
    if (data?.result === 'ok') {
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
