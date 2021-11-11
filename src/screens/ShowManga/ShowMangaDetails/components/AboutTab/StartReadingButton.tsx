import React, {useCallback} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {Button, FAB} from 'react-native-paper';
import {readingStatusInfo} from 'src/api';
import {ReadingStatusResponse} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {useBackgroundColor} from 'src/components/colors';
import {useDexifyNavigation} from 'src/foundation';
import {useMangaDetails} from '../../ShowMangaDetails';

type FABProps = React.ComponentProps<typeof FAB>;
type Props = Omit<FABProps, 'children' | 'style'>;

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

  const backgroundColor = useBackgroundColor('primary');

  const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 15,
      right: 0,
      bottom: 0,
      backgroundColor,
    },
  });

  if (loading) {
    return (
      <FAB loading {...props} style={styles.fab}>
        {''}
      </FAB>
    );
  }

  if (!chapterToRead) {
    return <FAB disabled {...props} style={styles.fab} />;
  }

  return <FAB {...props} style={styles.fab} onPress={readFirstChapter} />;
}
