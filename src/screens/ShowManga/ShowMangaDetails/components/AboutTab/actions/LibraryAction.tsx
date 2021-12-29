import React from 'react';
import {IconButton} from 'react-native-paper';
import {readingStatusInfo} from 'src/api';
import {AllReadingStatusResponse, ReadingStatus} from 'src/api/mangadex/types';
import {useBackgroundColor} from 'src/components/colors';
import {useIsLoggedIn} from 'src/prodivers';

interface Props {
  loading: boolean;
  readingStatus: ReadingStatus | null | undefined;
  onPress(): void;
}

export default function LibraryAction({
  loading,
  readingStatus,
  onPress,
}: Props) {
  const loggedIn = useIsLoggedIn();
  const readingStatusBackgroundColor = useBackgroundColor(
    readingStatusInfo(readingStatus).background,
  );

  if (loading || !loggedIn) {
    return <IconButton disabled icon="bookmark" />;
  }

  if (readingStatus) {
    return (
      <IconButton
        color={readingStatusBackgroundColor}
        icon="bookmark-check"
        onPress={onPress}
      />
    );
  }

  return <IconButton icon="bookmark" onPress={onPress} />;
}
