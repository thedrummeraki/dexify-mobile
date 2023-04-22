import {DateTime, Duration, DurationUnit} from 'luxon';
import {RelativeTimeFormatSingularUnit} from '@formatjs/ecma402-abstract';
import React, {useEffect, useState} from 'react';
import {FormattedRelativeTime} from 'react-intl';
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
import {localizedDateTime, pluralize, useDimensions} from 'src/utils';
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

  const [nextAiringEpisode, setNextAiringEpisode] =
    useState<YourAnime.AiringSchedule>();

  const units: RelativeTimeFormatSingularUnit[] = [
    'year',
    'month',
    'week',
    'day',
    'hour',
    'minute',
    'second',
  ];

  useEffect(() => {
    if (airingAnime) {
      getNextEpisode({variables: {slug: airingAnime.slug}});
    }
  }, [airingAnime]);

  useEffect(() => {
    if (data?.nextAiringEpisode) {
      setNextAiringEpisode(data.nextAiringEpisode);
    }
  }, [data]);

  if (!airingAnime?.nextEpisode) {
    return null;
  }

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (error) {
    return <Banner>Airing schedule is not available at the moment.</Banner>;
  }

  if (nextAiringEpisode) {
    const dateTime = DateTime.fromJSDate(
      new Date(nextAiringEpisode.airingAt * 1000),
    );
    const diff = dateTime.diffNow().shiftTo(...units);
    const unit = units.find(unit => diff.get(unit) !== 0) || 'second';

    return (
      <Card style={{marginHorizontal: -15, padding: 15}}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Text style={{marginRight: 3, fontWeight: 'bold'}}>
            Episode {nextAiringEpisode.episodeNumber}
          </Text>
          <FormattedRelativeTime value={diff.get(unit)} unit={unit} />
        </View>
        <Caption>
          {dateTime.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
        </Caption>
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
