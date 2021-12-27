import React, {PropsWithChildren, useState} from 'react';
import {View, ViewStyle} from 'react-native';
import {Button, Caption, Chip, Text, useTheme} from 'react-native-paper';
import {readingStatusInfo} from 'src/api';
import {ReadingStatus} from 'src/api/mangadex/types';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {
  PaperProviderForBackground,
  useBackgroundColor,
  useTextColor,
} from 'src/components/colors';
import { useDexifyNavigation } from 'src/foundation';
import {
  useLibraryContext,
  useLibraryStatus,
  useSession,
  useUpdatedSession,
} from 'src/prodivers';
import {usePossibleReadingStatuses} from 'src/screens/Home/screens/FollowedMangaScreen/FollowedMangaScreen';
import {useMangaDetails} from '../../ShowMangaDetails';

type ButtonProps = React.ComponentProps<typeof Button>;
type Props = Omit<ButtonProps, 'children' | 'style'> & {style?: ViewStyle, buttonContainerStyle?: ViewStyle};

export default function FollowMangaButton({style, children, buttonContainerStyle, ...props}: PropsWithChildren<Props>) {
  const navigation = useDexifyNavigation();
  const {manga} = useMangaDetails();
  const session = useSession();
  const readingStatus = useLibraryStatus(manga);
  const [updating, setUpdating] = useState(false);
  const possibleReadingStatuses = usePossibleReadingStatuses();
  const [showActions, setShowActions] = useState(false);

  if (!session) {
    return (
      <View style={style}>
        <View style={buttonContainerStyle}>
          <Button disabled mode='contained' icon="heart" {...props} style={{flex: 1, marginRight: 2}} onPress={undefined}>
            Mark as...
          </Button>
          <Button disabled mode='outlined' icon="plus" {...props} style={{flex: 1, marginLeft: 2}} onPress={undefined}>
            Add to list...
          </Button>
          </View>
      </View>
    );
  }

  const {content, background, defaultValue, icon} =
    readingStatusInfo(readingStatus);
  const theme = useTheme();
  const backgroundColor = useBackgroundColor(background);
  const color = useTextColor(background);

  return (
      <View style={style}>
        <View style={buttonContainerStyle}>
          <Button
            icon={icon}
            {...props}
            loading={updating}
            mode={defaultValue ? 'outlined' : 'contained'}
            style={{backgroundColor: updating ? undefined : backgroundColor, flex: 1, marginRight: 2}}
            labelStyle={{color}}
            onPress={() => setShowActions(value => !value)}>
            {updating ? '' : content}
          </Button>
          <Button
            mode="outlined"
            icon="plus"
            style={{flex: 1, marginLeft: 2}}
            onPress={() => navigation.push('AddToPlaylist', {manga})}
            >
            Add to list...
          </Button>
        </View>
        {showActions && (
          <>
            <CategoriesCollectionSection
              data={Object.entries(possibleReadingStatuses)}
              renderItem={item => {
                const [value, {title}] = item;
                const readingStatus = value as ReadingStatus;

                return (
                  <AddToLibraryChip
                    readingStatus={readingStatus}
                    title={title}
                    updating={updating}
                    setUpdating={setUpdating}
                    onComplete={() => setShowActions(false)}
                  />
                );
              }}
            />
          </>
        )}
      </View>
  );
}

function AddToLibraryChip({
  readingStatus,
  title,
  updating,
  setUpdating,
  onComplete,
}: {
  readingStatus: ReadingStatus;
  title: string;
  updating: boolean;
  setUpdating: (updating: boolean) => void;
  onComplete(): void;
}) {
  const {manga} = useMangaDetails();
  const {updateMangaReadingStatus, refreshReadingStatuses} =
    useLibraryContext();
  const currentReadingStatus = useLibraryStatus(manga);
  const selectedChipColor = useBackgroundColor('primary');
  const theme = useTheme();
  const {icon} = readingStatusInfo(readingStatus);

  const willAdd = currentReadingStatus !== readingStatus;

  const onPress = async () => {
    setUpdating(true);
    try {
      const response = await updateMangaReadingStatus!(
        manga.id,
        willAdd ? readingStatus : null,
      );
      if (response?.result === 'ok') {
        onComplete();
        return await refreshReadingStatuses!();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const selected = currentReadingStatus === readingStatus;

  return (
    <Chip
      icon={icon}
      selected={selected}
      disabled={updating}
      style={{
        backgroundColor: updating
          ? theme.colors.disabled
          : selected
          ? selectedChipColor
          : undefined,
      }}
      onPress={onPress}>
      {title}
    </Chip>
  );
}
