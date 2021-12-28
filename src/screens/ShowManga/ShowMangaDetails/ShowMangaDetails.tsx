import React, {PropsWithChildren, useContext, useState} from 'react';
import {View} from 'react-native';
import {
  BasicResultsResponse,
  CoverArt,
  Manga,
  PagedResultsList,
} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {AboutTab} from './components';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';

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
  const {data, loading, error} = useGetRequest<Manga.Aggregate>(
    `https://api.mangadex.org/manga/${manga.id}/aggregate?translatedLanguage[]=en`,
  );

  const {data: airingNow} = useGetRequest<{
    airing: boolean;
  }>(UrlBuilder.animeAiringInfo(manga.id));

  const {data: coverData, loading: coversLoading} = useGetRequest<
    PagedResultsList<CoverArt>
  >(
    UrlBuilder.covers({manga: [manga.id], limit: 100, order: {volume: 'desc'}}),
  );
  const [coverUrl, setCoverUrl] = useState<string>();

  const aggregate = data?.result === 'ok' ? data.volumes : undefined;
  const aggregateEntries = aggregate ? Object.entries(aggregate) : [];

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

  return (
    <ShowMangaDetailsProvider
      loading={loading || coversLoading}
      aggregate={aggregate}
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
