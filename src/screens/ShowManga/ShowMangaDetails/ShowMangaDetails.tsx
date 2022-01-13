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
  aggregate?: Manga.VolumeAggregateInfo;
  statistics?: Manga.Statistic;
  covers: CoverArt[];
  volumes: string[];
  volumeInfos: VolumeInfo[];
  error?: any;
  coverUrl?: string;
  onCoverUrlUpdate: (coverUrl: string) => void;
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
  const [getAggregate, {data, loading, error}] =
    useLazyGetRequest<Manga.Aggregate>(
      `https://api.mangadex.org/manga/${manga.id}/aggregate?translatedLanguage[]=en`,
    );

  const [getAiringInfo, {data: airingNow}] = useLazyGetRequest<{
    airing: boolean;
  }>(UrlBuilder.animeAiringInfo(manga.id));

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
    wait(1).then(() => getAggregate());
    wait(1).then(() => getMangaCovers());
    wait(1).then(() => getAiringInfo());
    wait(1).then(() => getStats());
  }, []);

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
      covers={covers}
      onCoverUrlUpdate={setCoverUrl}>
      <View style={{flex: 1}}>
        <AboutTab />
      </View>
    </ShowMangaDetailsProvider>
  );
}
