import {useEffect} from 'react';
import {useContentRatingFitlers} from 'src/prodivers';
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

export function useLazyGetMangaList(
  options?: MangaRequestParams,
  showEverything?: boolean,
): [
  (params?: MangaRequestParams) => Promise<ManyManga | undefined>,
  RequestResult<ManyManga>,
] {
  const allContentRatings = ['safe', 'erotica', 'suggestive', 'pornographic'] as ContentRating[];
  const contentRating = showEverything ? allContentRatings : useContentRatingFitlers();
  const [get, response] = useLazyGetRequest<ManyManga>();

  const getManga = (otherOptions?: MangaRequestParams) => {
    const defaultOptions = {contentRating};
    const url = UrlBuilder.mangaList(
      Object.assign(defaultOptions, Object.assign(options || {}, otherOptions)),
    );
    return get(url);
  };

  return [getManga, response];
}

export function useGetMangaList(options?: MangaRequestParams, showEverything?: boolean) {
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
