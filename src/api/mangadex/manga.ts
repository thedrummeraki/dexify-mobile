import {useGetRequest} from '../utils';
import {Manga, PagedResultsList} from './types';

export function useMangaList(): PagedResultsList<Manga> | undefined {
  const {data, error, loading} = useGetRequest<PagedResultsList<Manga>>(
    'https://api.mangadex.org/manga',
  );

  return data;
}
