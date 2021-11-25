import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {findRelationships} from 'src/api';
import {
  AllReadingStatusResponse,
  Manga,
  CustomList,
  PagedResultsList,
  ReadingStatus,
  ReadingStatusUpdateResponse,
  ContentRating,
  BasicResultsResponse,
} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest, usePostRequest} from 'src/api/utils';
import {useSession, useUpdatedSession} from '.';

interface CustomListInfo {
  customList: CustomList;
  manga: Manga[];
}

interface LibraryState {
  loading: boolean;
  readingStatus: AllReadingStatusResponse;
  refreshReadingStatuses(): Promise<AllReadingStatusResponse | undefined>;
  updateMangaReadingStatus(
    id: string,
    status: ReadingStatus | null,
  ): Promise<ReadingStatusUpdateResponse | undefined>;

  customListInfo: CustomListInfo[];
  refreshCustomLists(): Promise<PagedResultsList<CustomList> | undefined>;
  createCustomList(
    options: CustomList.CreateParams,
  ): Promise<CustomList | undefined>;
  updateCustomList(
    id: string,
    options: CustomList.UpdateParams,
  ): Promise<CustomList | undefined>;
  addMangaToCustomList(
    id: string,
    manga: string,
  ): Promise<BasicResultsResponse | undefined>;
}

export const LibraryContext = React.createContext<Partial<LibraryState>>({});

export function useLibraryContext() {
  return useContext(LibraryContext);
}

export function useLibraryStatus(manga: string | Manga) {
  let mangaId: string;
  if (typeof manga === 'string') {
    mangaId = manga;
  } else {
    mangaId = manga.id;
  }

  const {readingStatus} = useLibraryContext();
  const libraryStatus = readingStatus?.statuses[mangaId] || null;
  return libraryStatus || null;
}

export function useMangaIs(manga: string | Manga, status: ReadingStatus) {
  let mangaId: string;
  if (typeof manga === 'string') {
    mangaId = manga;
  } else {
    mangaId = manga.id;
  }

  const {readingStatus} = useLibraryContext();
  return readingStatus ? readingStatus.statuses[mangaId] === status : false;
}

export function useLibraryMangaIds(readingStatus?: ReadingStatus) {
  const {loading, readingStatus: data} = useLibraryContext();
  const ids: string[] = [];

  if (loading || !data?.statuses) {
    return null;
  }

  return Object.entries(data.statuses)
    .filter(([_, info]) =>
      readingStatus !== undefined ? info === readingStatus : true,
    )
    .map(([mangaId]) => mangaId);
}

export default function LibraryProvider({children}: PropsWithChildren<{}>) {
  const session = useSession();
  const {refreshToken} = useUpdatedSession();

  // Reading status (followed manga)
  const [
    getReadingStatus,
    {data: readingStatus, loading: readingStatusLoading},
  ] = useLazyGetRequest<AllReadingStatusResponse>(
    'https://api.mangadex.org/manga/status',
  );
  const [postReadingStatus, {loading: updating}] =
    usePostRequest<ReadingStatusUpdateResponse>();

  // Custom lists (library)
  const [customListInfo, setCustomListInfo] = useState<CustomListInfo[]>();
  const [getCustomLists, {data: customLists, loading: customListLoading}] =
    useLazyGetRequest<PagedResultsList<CustomList>>(
      'https://api.mangadex.org/user/list',
    );
  const [postCreateCustomList] = usePostRequest<CustomList>();
  const [postUpdateCustomList] = usePostRequest<CustomList>();
  const [postAddMangaToCustomList] = usePostRequest<BasicResultsResponse>();
  const [getManga] = useLazyGetRequest<PagedResultsList<Manga>>();

  const loading = readingStatusLoading || customListLoading;

  useEffect(() => {
    if (session) {
      getReadingStatus();
      getCustomLists();
    }
  }, [session]);

  useEffect(() => {
    if (customLists?.result === 'ok') {
      getManga(mangaListUrlsFrom(customLists.data))
        .then(response => {
          if (response?.result === 'ok') {
            const result: CustomListInfo[] = [];
            for (const customList of customLists.data) {
              const customListMangaIds = findRelationships(
                customList,
                'manga',
              ).map(r => r.id);
              const manga = response.data.filter(m =>
                customListMangaIds.includes(m.id),
              );
              result.push({customList, manga});
            }
            setCustomListInfo(result);
          }
        })
        .catch(console.error);
    }
  }, [customLists]);

  const updateMangaReadingStatus = useCallback(
    async (id: string, status: ReadingStatus) => {
      try {
        const authResponse = await refreshToken();
        if (authResponse && authResponse.result !== 'ok') {
          console.warn(
            'could not refresh session token:',
            JSON.stringify(authResponse),
          );
          return;
        }

        return await postReadingStatus(
          `https://api.mangadex.org/manga/${id}/status`,
          {
            status,
          },
        );
      } catch (error) {
        console.error(error);
      }
    },
    [],
  );

  const createCustomList = useCallback(
    async (options: CustomList.CreateParams) => {
      try {
        const authResponse = await refreshToken();
        if (authResponse && authResponse.result !== 'ok') {
          console.warn(
            'could not refresh session token:',
            JSON.stringify(authResponse),
          );
          return;
        }

        return await postCreateCustomList('https://api.mangadex.org/list', {
          ...options,
          version: 1,
        });
      } catch (error) {
        console.error('create custom list', error);
      }
    },
    [],
  );

  const addMangaToCustomList = useCallback(
    async (id: string, manga: string) => {
      try {
        const authResponse = await refreshToken();
        if (authResponse && authResponse.result !== 'ok') {
          console.warn(
            'could not refresh session token:',
            JSON.stringify(authResponse),
          );
          return;
        }

        return await postAddMangaToCustomList(
          `https://api.mangadex.org/manga/${manga}/list/${id}`,
        );
      } catch (error) {
        console.error('create custom list', error);
      }
    },
    [],
  );

  return (
    <LibraryContext.Provider
      value={{
        loading: loading || updating,
        readingStatus,
        refreshReadingStatuses: getReadingStatus,
        updateMangaReadingStatus,
        refreshCustomLists: getCustomLists,
        createCustomList,
        addMangaToCustomList,
        customListInfo,
      }}>
      {children}
    </LibraryContext.Provider>
  );
}

function mangaListUrlsFrom(customLists: CustomList[]) {
  const mangasIds: string[] = [];
  for (const customList of customLists) {
    for (const id of findRelationships(customList, 'manga').map(r => r.id)) {
      if (!mangasIds.includes(id)) {
        mangasIds.push(id);
      }
    }
  }

  return UrlBuilder.mangaList({
    ids: mangasIds,
    limit: mangasIds.length,
    contentRating: Object.values(ContentRating),
  });
}
