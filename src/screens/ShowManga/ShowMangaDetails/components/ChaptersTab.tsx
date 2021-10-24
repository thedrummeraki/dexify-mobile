import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';
import {Manga, PagedResultsList, Chapter} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {Banner} from 'src/components';
import BasicList from 'src/components/BasicList';
import {useDexifyNavigation} from 'src/foundation';

interface Props {
  manga: Manga;
  loading: boolean;
  aggregate?: Manga.VolumeAggregateInfo;
  error?: any;
}

export default function ChaptersTab({manga, loading, aggregate, error}: Props) {
  const navigation = useDexifyNavigation();
  const [showBanner, setShowBanner] = useState(true);
  const aggregateEntries = aggregate ? Object.entries(aggregate) : [];

  // const chapters: {[key: string]: Chapter[]} = {};
  // if (data?.result === 'ok') {
  //   for (const chapter of data.data) {
  //     const key = chapter.attributes.chapter || 'N/A';
  //     if (chapters[key]) {
  //       chapters[key].push(chapter);
  //     } else {
  //       chapters[key] = [chapter];
  //     }
  //   }
  // }

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (error) {
    console.error(error);
    return <Text>Uh oh, could not fetch chapters for this manga.</Text>;
  }

  if (aggregateEntries.length === 0) {
    return <Text>No chapters are available yet for this manga.</Text>;
  }

  return (
    <ScrollView style={{flex: 1}}>
      <Banner
        visible={showBanner}
        title="Support the manga industry"
        body="If you enjoy this manga, consider buying from the official publisher."
        // primaryAction={{
        //   content: 'Learn more',
        //   onAction: () => console.log('yee!!...?'),
        // }}
        onDismiss={() => setShowBanner(false)}
      />
      {aggregateEntries.map(([volume, chaptersInfo]) => {
        const chapters = Object.entries(chaptersInfo.chapters).map(
          ([_, chapters]) => chapters,
        );

        return (
          <>
            <Title>{volume ? `Volume ${volume}` : 'Other'}</Title>
            <BasicList
              data={chapters}
              aspectRatio={1 / 4}
              renderItem={item => (
                <Button
                  key={item.id}
                  mode="outlined"
                  onPress={() => navigation.navigate('ShowChapter', {...item})}>
                  {item.chapter === 'none' ? 'N/A' : item.chapter}
                </Button>
              )}
            />
          </>
        );
      })}
    </ScrollView>
  );
}
