import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import {
  BasicResultsResponse,
  CoverArt,
  Manga,
  PagedResultsList,
} from 'src/api/mangadex/types';
import {useLazyGetRequest} from 'src/api/utils';
import {AboutTab} from './components';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {wait} from 'src/utils';
import {useYourAnimeShow} from 'src/api/youranime/hooks';
import {YourAnime} from 'src/api/youranime';

const Tab = createMaterialTopTabNavigator();

interface Props {
  manga: Manga;
}

export interface VolumeInfo {
  volume: string | null;
  chapterIds: string[];
}

interface MangaDetails {
  loading: boolean;
  manga: Manga;
  isAiring?: boolean;
  airingAnime?: YourAnime.Anime;
  aggregate?: Manga.VolumeAggregateInfo;
  preferredLanguages: string[];
  statistics?: Manga.Statistic;
  covers: CoverArt[];
  volumes: string[];
  volumeInfos: VolumeInfo[];
  error?: any;
  coverUrl?: string;
  onCoverUrlUpdate: (coverUrl: string) => void;
  onPreferredLanguagesChange: (preferredLanguages: string[]) => void;
}

const ShowMangaDetailsContext = React.createContext<MangaDetails>(
  {} as MangaDetails,
);

function ShowMangaDetailsProvider({
  children,
  ...rest
}: PropsWithChildren<MangaDetails>) {
  return (
    <ShowMangaDetailsContext.Provider value={rest}>
      {children}
    </ShowMangaDetailsContext.Provider>
  );
}

export function useMangaDetails() {
  return useContext(ShowMangaDetailsContext);
}

export default function ShowMangaDetails({manga}: Props) {
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>([]);

  const [getAggregate, {data, loading, error}] =
    useLazyGetRequest<Manga.Aggregate>();

  const [getAiringInfo, {data: airingNow}] = useLazyGetRequest<{
    airing: boolean;
    slug: string | null;
  }>(UrlBuilder.animeAiringInfo(manga.id));

  const [getAnimeInfo, {data: animeInfo}] = useYourAnimeShow();

  const [getMangaCovers, {data: coverData, loading: coversLoading}] =
    useLazyGetRequest<PagedResultsList<CoverArt>>(
      UrlBuilder.covers({
        manga: [manga.id],
        limit: 100,
        order: {volume: 'desc'},
      }),
    );

  const [getStats, {data: statsData, loading: statsLoading}] =
    useLazyGetRequest<Manga.StatisticsResponse>(
      UrlBuilder.mangaStatistics(manga.id),
    );

  const [coverUrl, setCoverUrl] = useState<string>();

  const aggregate = data?.result === 'ok' ? data.volumes : undefined;
  const aggregateEntries = aggregate ? Object.entries(aggregate) : [];

  const allStats =
    statsData?.result === 'ok' ? statsData.statistics : undefined;
  const stats = allStats ? allStats[manga.id] : undefined;

  const volumes = aggregateEntries.map(([volume, _]) => volume);
  const covers = coverData?.result === 'ok' ? coverData.data : [];

  const volumeInfos: VolumeInfo[] = aggregateEntries.map(
    ([volume, details]) => {
      const chapterIds = Object.entries(details.chapters).map(
        ([_, detail]) => detail.id,
      );

      return {
        volume: volume === 'none' ? null : volume,
        chapterIds,
      };
    },
  );

  useEffect(() => {
    wait(1).then(() => getMangaCovers());
    wait(1).then(() => getAiringInfo());
    wait(1).then(() => getStats());
  }, []);

  useEffect(() => {
    wait(1).then(() =>
      getAggregate(
        UrlBuilder.mangaVolumesAndChapters(manga.id, {
          translatedLanguage: preferredLanguages,
        }),
      ),
    );
  }, [manga.id, preferredLanguages]);

  useEffect(() => {
    if (airingNow?.slug) {
      getAnimeInfo({variables: {slug: airingNow.slug}});
    }
  }, [airingNow]);

  return (
    <ShowMangaDetailsProvider
      loading={loading || coversLoading}
      aggregate={aggregate}
      statistics={stats}
      volumes={volumes}
      volumeInfos={volumeInfos}
      manga={manga}
      error={error}
      coverUrl={coverUrl}
      isAiring={airingNow?.airing}
      airingAnime={animeInfo?.show}
      covers={covers}
      onCoverUrlUpdate={setCoverUrl}
      preferredLanguages={preferredLanguages}
      onPreferredLanguagesChange={setPreferredLanguages}>
      <View style={{flex: 1}}>
        <AboutTab />
      </View>
    </ShowMangaDetailsProvider>
  );
}
