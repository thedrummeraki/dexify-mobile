import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, Caption, Chip, Text, useTheme} from 'react-native-paper';
import {readingStatusInfo} from 'src/api';
import {ReadingStatus} from 'src/api/mangadex/types';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {
  PaperProviderForBackground,
  useBackgroundColor,
  useTextColor,
} from 'src/components/colors';
import {
  useLibraryContext,
  useLibraryStatus,
  useSession,
  useUpdatedSession,
} from 'src/prodivers';
import {usePossibleReadingStatuses} from 'src/screens/Home/screens/MyLibraryNavigationScreen/MyLibraryNavigationScreen';
import {useMangaDetails} from '../../ShowMangaDetails';

type ButtonProps = React.ComponentProps<typeof Button>;
type Props = Omit<ButtonProps, 'children'>;

export default function LibraryButton({style, ...props}: Props) {
  const {manga} = useMangaDetails();
  const session = useSession();
  const readingStatus = useLibraryStatus(manga);
  const [updating, setUpdating] = useState(false);
  const possibleReadingStatuses = usePossibleReadingStatuses();
  const [showActions, setShowActions] = useState(false);

  if (!session) {
    return (
      <Button disabled icon="plus" {...props} onPress={undefined}>
        Add to library
      </Button>
    );
  }

  const {content, background, icon} = readingStatusInfo(readingStatus);
  const backgroundColor = useBackgroundColor(background);
  const color = useTextColor(background);

  return (
    <View style={style}>
      <PaperProviderForBackground background={background}>
        <Button
          icon={icon}
          {...props}
          loading={updating}
          style={{backgroundColor: updating ? undefined : backgroundColor}}
          labelStyle={{color}}
          onPress={() => setShowActions(value => !value)}>
          {updating ? '' : content}
        </Button>
      </PaperProviderForBackground>
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
}: {
  readingStatus: ReadingStatus;
  title: string;
  updating: boolean;
  setUpdating: (updating: boolean) => void;
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
