import {DateTime} from 'luxon';
import React, {useEffect} from 'react';
import {Image, Linking, Pressable, ScrollView, View} from 'react-native';
import {
  ActivityIndicator,
  Caption,
  Card,
  Paragraph,
  Text,
  Title,
} from 'react-native-paper';
import {YourAnime} from 'src/api/youranime';
import {useNextEpisodeForShow} from 'src/api/youranime/hooks';
import {Banner, FullScreenModal} from 'src/components';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import Thumbnail from 'src/foundation/Thumbnail';
import {PlatformIcons, platforms} from 'src/icons';
import {localizedDateTime, useDimensions} from 'src/utils';
import {useMangaDetails} from '../../../ShowMangaDetails';

interface Props {
  visible: boolean;
  loading: boolean;
  onDismiss(): void;
}

export default function AiringAnimeModal({visible, onDismiss}: Props) {
  const {airingAnime} = useMangaDetails();

  const startsOn = localTime(airingAnime?.startsOn);
  const endsOn = localTime(airingAnime?.endedOn);
  const airingTimesDescription = [];

  if (startsOn && endsOn) {
    airingTimesDescription.push('From', startsOn, 'to', endsOn);
  } else if (endsOn) {
    airingTimesDescription.push('Until', endsOn);
  } else if (startsOn) {
    airingTimesDescription.push('Started on', startsOn);
  }

  return (
    <FullScreenModal
      visible={visible}
      title="About the airing anime"
      onDismiss={onDismiss}>
      {airingAnime ? (
        <ScrollView>
          <AnimeImage anime={airingAnime} />
          <View style={{paddingHorizontal: 15, paddingVertical: 10}}>
            <Title>{airingAnime.title}</Title>
            <Caption>{airingTimesDescription.join(' ')}</Caption>
            <CategoriesCollectionSection
              data={airingAnime.links}
              renderItem={link => {
                const {platform, value: url} = link;
                if (!platform || !url) {
                  return null;
                }

                return <PlatformIcon platform={platform} url={url} />;
              }}
            />

            {airingAnime.nextEpisode ? (
              <View style={{marginTop: 15}}>
                <AiringInfo />
              </View>
            ) : null}

            <View style={{marginTop: 15}}>
              <Paragraph>{airingAnime.description}</Paragraph>
            </View>
          </View>
        </ScrollView>
      ) : null}
    </FullScreenModal>
  );
}

function AnimeImage({anime}: {anime: YourAnime.Anime}) {
  const {width} = useDimensions();

  if (anime.bannerUrl) {
    return (
      <View style={{position: 'relative', marginBottom: 30}}>
        {anime.bannerUrl ? (
          <View style={{opacity: 0.6}}>
            <Thumbnail
              imageUrl={anime.bannerUrl}
              width={width}
              aspectRatio={2}
            />
          </View>
        ) : null}
        <View style={{position: 'absolute', bottom: -25, left: 15, zIndex: 1}}>
          <Thumbnail imageUrl={anime.posterUrl} width={120} height={180} />
        </View>
      </View>
    );
  } else {
    return (
      <View style={{position: 'absolute', bottom: -25, left: 15}}>
        <Thumbnail imageUrl={anime.posterUrl} width={120} height={180} />
      </View>
    );
  }
}

function AiringInfo() {
  const [getNextEpisode, {data, loading, error}] = useNextEpisodeForShow();
  const {airingAnime} = useMangaDetails();

  useEffect(() => {
    if (airingAnime) {
      getNextEpisode({variables: {slug: airingAnime.slug}});
    }
  }, [airingAnime]);

  if (!airingAnime?.nextEpisode) {
    return null;
  }

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (error) {
    return <Banner>Airing schedule is not available at the moment.</Banner>;
  }

  if (data?.nextAiringEpisode) {
    return (
      <Card style={{marginHorizontal: -15, padding: 15}}>
        <Text>Episode {data.nextAiringEpisode.episodeNumber}</Text>
        <Text>
          {DateTime.fromJSDate(
            new Date(data.nextAiringEpisode.airingAt * 1000),
          ).toLocaleString(DateTime.DATETIME_MED)}
        </Text>
      </Card>
    );
  }

  return null;
}

function PlatformIcon({
  platform,
  url,
}: {
  platform: YourAnime.Platform;
  url: string;
}) {
  const {name} = platform;

  if (!isPlatform(name)) {
    return <Text>{name}</Text>;
  }

  return (
    <Pressable onPress={() => Linking.openURL(url)}>
      <Image
        source={platforms[name]}
        style={{width: 50, height: 50, borderRadius: 100}}
        height={50}
        width={50}
      />
    </Pressable>
  );
}

function isPlatform(name: string): name is PlatformIcons {
  return Object.keys(platforms).includes(name);
}

function localTime(string?: string) {
  return string ? localizedDateTime(string, DateTime.DATE_MED) : null;
}
