import {useLazyQuery} from '@apollo/client';
import React, {useState, useMemo, useEffect} from 'react';
import {ActivityIndicator, ScrollView} from 'react-native';
import {Badge, Text} from 'react-native-paper';
import {preferredMangaTitle} from 'src/api';
import {Kitsu} from 'src/api/kitsu';
import {friendlyStatus, preferredThumbnailImage} from 'src/api/kitsu/utils';
import {Manga} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {YourAnime} from 'src/api/youranime';
import Queries from 'src/api/youranime/queries';
import BasicList from 'src/components/BasicList';
import Thumbnail from 'src/foundation/Thumbnail';
import {levenshteinDistance} from 'src/utils';

interface Props {
  manga: Manga;
}

export default function AnimeDetailsTab({manga}: Props) {
  const title = preferredMangaTitle(manga);
  const [results, setResults] = useState<Kitsu.Anime[]>([]);
  const [yourAnimeResults, setYourAnimeResults] = useState<
    YourAnime.AnimeSearchResult[]
  >([]);
  const [slugs, setSlugs] = useState<string[]>([]);
  const {
    data,
    loading: kitsuLoading,
    error,
  } = useGetRequest<Kitsu.PagedResultsList<Kitsu.Anime>>(
    `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(title)}`,
  );
  const [getShowsBySlug, yourAnimeResult] = useLazyQuery(
    Queries.GetShowsBySlug,
  );

  const loading = kitsuLoading || yourAnimeResult.loading;

  const filteredResults = useMemo(
    () =>
      results.filter(
        anime =>
          levenshteinDistance(title, anime.attributes.canonicalTitle) >= 0.9 ||
          anime.attributes.canonicalTitle
            .toLowerCase()
            .startsWith(title.toLowerCase()),
      ),
    [results],
  );

  console.log('youranime.moe res', slugs);

  useEffect(() => {
    if (filteredResults.length === 0) {
      setSlugs(results.map(result => result.attributes.slug));
    } else {
      setSlugs(filteredResults.map(result => result.attributes.slug));
    }
  }, [filteredResults, results]);

  useEffect(() => {
    getShowsBySlug({variables: {slugs, first: 20}});
  }, [slugs]);

  useEffect(() => {
    if (yourAnimeResult.data?.shows?.edges) {
      setYourAnimeResults(
        yourAnimeResult.data.shows.edges.map(edge => edge.node),
      );
    }
  }, [yourAnimeResult]);

  useEffect(() => {
    setResults(data?.data || []);
  }, [data]);

  if (loading) {
    return <ActivityIndicator size="large" style={{flex: 1}} />;
  }

  if (!data || error) {
    console.error(
      `Uh oh, something went wrong while fetching "${title}"...`,
      error,
    );
    return <Text>Uh oh, something went wrong while fetching "{title}"...</Text>;
  }

  if (results.length === 0) {
    return <Text>No anime shows were found for this manga.</Text>;
  }

  // if (filteredResults.length === 0 || yourAnimeResults.length === 0) {
  //   return (
  //     <ScrollView>
  //       <BasicList
  //         data={results}
  //         aspectRatio={results.length > 4 ? 1 / 3 : 1 / 2}
  //         renderItem={item => (
  //           <Thumbnail
  //             TopComponent={
  //               <Badge style={{borderRadius: 0, borderBottomRightRadius: 7}}>
  //                 {friendlyStatus(item.attributes.status)}
  //               </Badge>
  //             }
  //             imageUrl={preferredThumbnailImage(item)}
  //             title={item.attributes.canonicalTitle}
  //             width="100%"
  //             aspectRatio={0.8}
  //           />
  //         )}
  //       />
  //     </ScrollView>
  //   );
  // }

  // Todo: get a currently anime's slug, query YourAnime.moe and show info here
  // Then show other shows in BasicList in a section (ex: "Other anime series")

  return (
    <ScrollView>
      <BasicList
        data={yourAnimeResults}
        aspectRatio={yourAnimeResults.length > 4 ? 1 / 3 : 1 / 2}
        renderItem={item => (
          <Thumbnail
            TopComponent={
              <Badge style={{borderRadius: 0, borderBottomRightRadius: 7}}>
                {item.friendlyStatus}
              </Badge>
            }
            imageUrl={item.posterUrl}
            title={item.title}
            width="100%"
            aspectRatio={0.8}
          />
        )}
      />
    </ScrollView>
  );
}
