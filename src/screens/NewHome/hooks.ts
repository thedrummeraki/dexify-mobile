import {useContext, useEffect, useRef, useState} from 'react';
import {HomeContext} from './HomeProvider';
import {
  HomePresenter,
  HomePresenterData,
  Sections,
} from './HomePresenter/Section/types';
import {FeedResponse} from './Feed/types';
import {useLazyGetRequest} from 'src/api/utils';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {AxiosError} from 'axios';
import {useContentRatingFitlers, useSettingsContext} from 'src/prodivers';

interface FeedPresenter {
  loading: boolean;
  error?: AxiosError;
  data?: FeedResponse;
  refresh(): Promise<FeedResponse | undefined>;
}

export function useFeed(): FeedPresenter {
  const {loading} = useSettingsContext();
  const contentRating = useContentRatingFitlers();
  const [refresh, response] = useLazyGetRequest<FeedResponse>(
    UrlBuilder.feed({contentRating}),
  );

  useEffect(() => {
    if (!loading) {
      refresh();
    }
  }, [refresh, loading]);

  return {...response, refresh};
}

export function useHomePresenter(): HomePresenter {
  const initialized = useRef(false);
  const [data, setData] = useState<HomePresenterData>();
  const {loading, ...fetchedData} = useContext(HomeContext);

  useEffect(() => {
    if (fetchedData && !initialized.current) {
      const {popularManga, airingNow, checkTheseOut, randomManga, readingNow} =
        fetchedData;
      const topManga = popularManga?.length ? popularManga[0] : null;

      const homeSections: Sections.HomeSection[] = [];

      homeSections.push({
        slug: 'reading-now',
        type: 'general',
        title: 'Reading now',
        manga: readingNow || [],
      });
      homeSections.push({
        slug: 'airing-now',
        type: 'general',
        title: 'Airing now',
        manga: airingNow || [],
      });
      if (randomManga) {
        homeSections.push({
          slug: 'random-recommendation',
          type: 'manga-recommendation',
          manga: randomManga,
        });
      }
      homeSections.push({
        slug: 'check-these-out',
        type: 'general',
        title: 'Check these out',
        manga: checkTheseOut || [],
      });
      homeSections.push({
        slug: 'most-popular',
        type: 'general',
        title: 'Most popular',
        manga: popularManga || [],
      });

      if (topManga && homeSections.length) {
        setData({topManga, homeSections});
        initialized.current = true;
      }
    }
  }, [fetchedData]);

  return {loading, errored: false, data};
}
