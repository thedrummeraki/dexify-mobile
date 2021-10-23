import {useQuery} from '@apollo/client';
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Image, ScrollView, View} from 'react-native';
import {Text} from 'react-native-paper';
import {preferredMangaTitle} from 'src/api';
import {preferredThumbnailImage} from 'src/api/kitsu/utils';
import {Manga} from 'src/api/mangadex/types';
import {YourAnime} from 'src/api/youranime';
import Queries from 'src/api/youranime/queries';
import BasicList from 'src/components/BasicList';
import Thumbnail from 'src/foundation/Thumbnail';
import {platformIcon, PlatformIcons} from 'src/icons';

interface Props {
  manga: Manga;
}

export default function AnimeDetailsTab({manga}: Props) {
  const title = preferredMangaTitle(manga);
  const [currentAnime, setCurrentAnime] =
    useState<YourAnime.AnimeSearchResult>();
  const [results, setResults] = useState<YourAnime.AnimeSearchResult[]>([]);
  const {data, loading, error} = useQuery(Queries.GetShowsBySlug, {
    variables: {text: title},
  });

  useEffect(() => {
    setResults(data?.shows || []);
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

  // Todo: get a currently anime's slug, query YourAnime.moe and show info here
  // Then show other shows in BasicList in a section (ex: "Other anime series")

  return (
    <ScrollView>
      <BasicList
        data={results}
        aspectRatio={results.length > 4 ? 1 / 3 : 1 / 2}
        renderItem={item => (
          <Thumbnail
            TopComponent={
              // <Badge style={{borderRadius: 0, borderBottomRightRadius: 7}}>
              //   {item.platforms.map(platform => platform.title).join(' - ')}
              // </Badge>
              <View style={{flex: 1, flexDirection: 'row'}}>
                {item.platforms.map(platform => (
                  <Image
                    key={platform.name}
                    source={platformIcon(platform.name as PlatformIcons)}
                    width={24}
                    height={24}
                    style={{height: 24, width: 24}}
                  />
                ))}
              </View>
            }
            imageUrl={preferredThumbnailImage(item.posterImage)}
            title={item.canonicalTitle}
            width="100%"
            aspectRatio={0.8}
            onPress={() => setCurrentAnime(item)}
          />
        )}
      />
    </ScrollView>
  );
}
