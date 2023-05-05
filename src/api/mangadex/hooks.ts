import {useCallback, useEffect, useMemo, useState} from 'react';
import {useContentRatingFitlers, useMangadexSettings} from 'src/prodivers';
import {RequestResult, useLazyGetRequest} from '../utils';
import {
  ContentRating,
  EntityResponse,
  Manga,
  MangaRequestParams,
  PagedResultsList,
  SingleMangaRequestParams,
} from './types';
import UrlBuilder from './types/api/url_builder';

type ManyManga = PagedResultsList<Manga>;
type OneManga = EntityResponse<Manga>;

export function useMangadexPagination(resetsWhenChanged: readonly any[]) {
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const {
    userPreferences: {paginationCount: limit},
  } = useMangadexSettings();

  const previousPage = useCallback(() => setPage(page => page - 1), []);
  const nextPage = useCallback(() => {
    console.log('going to next page from', page, 'to', page + 1);
    setPage(page => page + 1);
  }, [page]);

  const resetPage = () => {
    setPage(1);
  };

  const nextOffset = useMemo(() => page * limit, [page, limit]);

  useEffect(() => {
    if (page < 1) {
      setPage(1);
    } else {
      setOffset((page - 1) * limit);
      console.log('updated offset');
    }
  }, [page, limit]);

  useEffect(() => {});

  useEffect(() => {
    resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetsWhenChanged);

  return {
    page,
    offset,
    limit,
    nextOffset,
    previousPage,
    nextPage,
    resetPage,
  };
}

export function useLazyGetMangaList(
  options?: MangaRequestParams,
  showEverything?: boolean,
): [
  (params?: MangaRequestParams) => Promise<ManyManga | undefined>,
  RequestResult<ManyManga>,
] {
  const allContentRatings = [
    'safe',
    'erotica',
    'suggestive',
    'pornographic',
  ] as ContentRating[];
  const allowedContentRatings = useContentRatingFitlers();
  const contentRating = showEverything
    ? allContentRatings
    : allowedContentRatings;
  const [get, response] = useLazyGetRequest<ManyManga>();

  const getManga = (otherOptions?: MangaRequestParams) => {
    const defaultOptions = {contentRating};
    const url = UrlBuilder.mangaList(
      Object.assign(defaultOptions, {...options, ...otherOptions}),
    );
    return get(url);
  };

  return [getManga, response];
}

export function useGetMangaList(
  options?: MangaRequestParams,
  showEverything?: boolean,
) {
  const [getManga, response] = useLazyGetMangaList(options, showEverything);

  useEffect(() => {
    getManga(options);
  }, []);

  return response;
}

export function useLazyManga(
  id: string,
  options?: SingleMangaRequestParams,
): [() => Promise<OneManga | undefined>, RequestResult<OneManga>] {
  const [get, response] = useLazyGetRequest<OneManga>();

  const getManga = () => {
    const url = UrlBuilder.mangaById(id, options);
    return get(url);
  };

  return [getManga, response];
}

export function useManga(id: string, options?: SingleMangaRequestParams) {
  const [getManga, response] = useLazyManga(id, options);

  useEffect(() => {
    getManga();
  }, []);

  return response;
}
