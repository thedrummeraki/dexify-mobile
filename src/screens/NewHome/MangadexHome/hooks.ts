import {useEffect, useState} from 'react';
import {findRelationship, findRelationships} from 'src/api';
import {useGetMangaList, useLazyGetMangaList} from 'src/api/mangadex/hooks';
import {
  Chapter,
  EntityResponse,
  Manga,
  MangaRequestParams,
  PagedResultsList,
} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {RequestResult, useGetRequest, useLazyGetRequest} from 'src/api/utils';
import {useContentRatingFitlers, useMangadexSettings} from 'src/prodivers';
import {notEmpty, toMangadexStringDate} from 'src/utils';

export function usePopularManga(options?: MangaRequestParams) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  oneMonthAgo.setHours(0, 0, 0, 0);

  const contentRating = useContentRatingFitlers();
  const [get, response] = useLazyGetMangaList();

  useEffect(() => {
    get({
      includes: ['cover_art', 'artist', 'author'],
      order: {followedCount: 'desc'},
      contentRating,
      hasAvailableChapters: 'true',
      createdAtSince: toMangadexStringDate(oneMonthAgo),
      ...options,
    });
  }, [contentRating]);

  return response;
}

export function useSeasonalManga() {
  const [mangaIds, setMangaIds] = useState<string[]>();
  const [getMangaIds] = useLazyGetRequest<string[]>(
    UrlBuilder.mangaIdsWithAiringAnime(),
  );
  const [getMangaList, response] = useLazyGetMangaList();

  useEffect(() => {
    getMangaIds().then(ids => {
      if (ids) {
        setMangaIds(ids);
      }
    });
  }, []);

  useEffect(() => {
    if (mangaIds) {
      getMangaList({ids: mangaIds});
    }
  }, [mangaIds]);

  return response;
}

export function useNewlyPublishedChapters() {
  const contentRating = useContentRatingFitlers();
  const {
    userPreferences: {paginationCount},
  } = useMangadexSettings();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  const chaperResponse = useGetRequest<PagedResultsList<Chapter>>(
    UrlBuilder.chaptersList({
      contentRating,
      order: {readableAt: 'desc'},
    }),
  );

  const [fetchManga] = useLazyGetMangaList();

  useEffect(() => {
    if (chaperResponse.data?.result === 'ok') {
      const foundChapters = chaperResponse.data.data;
      const mangaIds = foundChapters
        .map(chapter => findRelationship(chapter, 'manga')?.id)
        .filter(notEmpty);

      console.log({mangaIds});

      setChapters(foundChapters);
      if (mangaIds.length) {
        fetchManga({ids: mangaIds})
          .then(mangaResponse => {
            if (mangaResponse?.result === 'ok') {
              setManga(mangaResponse.data);
            }
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [chaperResponse.data]);

  return {chapters, manga, loading};
}

export function useNewlyReleasedTitles() {
  const contentRating = useContentRatingFitlers();
  const [get, response] = useLazyGetMangaList();

  useEffect(() => {
    get({
      contentRating,
      order: {createdAt: 'desc'},
      includes: ['cover_art', 'artist', 'author'],
      limit: 15,
    });
  }, [contentRating]);

  return response;
}

export function useRandomManga() {
  const contentRating = useContentRatingFitlers();
  const [get, response] = useLazyGetRequest<EntityResponse<Manga>>();

  useEffect(() => {
    get(
      UrlBuilder.randomManga({
        contentRating,
        includes: ['cover_art', 'author', 'artist', 'manga'],
      }),
    );
  }, [contentRating]);

  return response;
}
