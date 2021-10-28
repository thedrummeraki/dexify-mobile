import React, {useCallback} from 'react';
import {ViewStyle} from 'react-native';
import {Button} from 'react-native-paper';
import {readingStatusInfo} from 'src/api';
import {ReadingStatusResponse} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {useDexifyNavigation} from 'src/foundation';
import {useMangaDetails} from '../../ShowMangaDetails';

type ButtonProps = React.ComponentProps<typeof Button>;
type Props = Omit<ButtonProps, 'children'>;

export default function StartReadingButton({...props}: Props) {
  const navigation = useDexifyNavigation();
  const {loading, aggregate} = useMangaDetails();

  const aggregateEntries = Object.entries(aggregate || {});
  const chapterToRead =
    aggregateEntries.length > 0
      ? Object.entries(aggregateEntries[0][1].chapters)[0][1]
      : null;

  const readFirstChapter = useCallback(() => {
    if (chapterToRead) {
      navigation.navigate('ShowChapter', {id: chapterToRead.id});
    }
  }, [chapterToRead]);

  if (loading) {
    return (
      <Button loading {...props}>
        {''}
      </Button>
    );
  }

  if (!chapterToRead) {
    return (
      <Button icon="play" disabled {...props}>
        Start reading now
      </Button>
    );
  }

  return (
    <Button icon="play" {...props} onPress={readFirstChapter}>
      Start reading now
    </Button>
  );
}
