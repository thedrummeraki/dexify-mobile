import {useQuery} from '@apollo/client';
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Image, ScrollView, View} from 'react-native';
import {Text} from 'react-native-paper';
import {preferredMangaTitle} from 'src/api';
import {preferredThumbnailImage} from 'src/api/kitsu/utils';
import {Manga} from 'src/api/mangadex/types';
import {YourAnime} from 'src/api/youranime';
import Queries from 'src/api/youranime/queries';
import {Banner} from 'src/components';
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
    return (
      <ScrollView>
        <Banner
          background="error"
          title="No anime series found"
          body="We tried looking through the stars but couldn't find anything."
        />
      </ScrollView>
    );
  }

  // Todo: get a currently anime's slug, query YourAnime.moe and show info here
  // Then show other shows in BasicList in a section (ex: "Other anime series")

  const platformIconSize = results.length > 4 ? 18 : 32;

  return (
    <ScrollView>
      <BasicList
        data={results}
        aspectRatio={results.length > 4 ? 1 / 3 : 1 / 2}
        renderItem={item => (
          <Thumbnail
            BottomComponent={
              // <Badge style={{borderRadius: 0, borderBottomRightRadius: 7}}>
              //   {item.platforms.map(platform => platform.title).join(' - ')}
              // </Badge>
              <View style={{flex: 1, flexDirection: 'row', padding: 5}}>
                {item.platforms.map(platform => (
                  <Image
                    key={platform.name}
                    source={platformIcon(platform.name as PlatformIcons)}
                    width={platformIconSize}
                    height={platformIconSize}
                    style={{
                      height: platformIconSize,
                      width: platformIconSize,
                      marginRight: 5,
                      borderRadius: 1024,
                    }}
                  />
                ))}
              </View>
            }
            imageUrl={preferredThumbnailImage(item.posterImage)}
            title={item.canonicalTitle}
            width="100%"
            aspectRatio={0.7}
            onPress={() => setCurrentAnime(item)}
          />
        )}
      />
    </ScrollView>
  );
}
