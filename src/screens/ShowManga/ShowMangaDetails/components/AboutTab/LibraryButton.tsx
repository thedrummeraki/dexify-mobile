import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, Chip} from 'react-native-paper';
import {readingStatusInfo} from 'src/api';
import {ReadingStatus} from 'src/api/mangadex/types';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {useBackgroundColor} from 'src/components/colors';
import {useLibraryContext, useLibraryStatus, useSession} from 'src/prodivers';
import {usePossibleReadingStatuses} from 'src/screens/Home/screens/MyLibraryNavigationScreen/MyLibraryNavigationScreen';
import {useMangaDetails} from '../../ShowMangaDetails';

type ButtonProps = React.ComponentProps<typeof Button>;
type Props = Omit<ButtonProps, 'children'>;

export default function LibraryButton({style, ...props}: Props) {
  const {manga} = useMangaDetails();
  const session = useSession();
  const readingStatus = useLibraryStatus(manga);
  const possibleReadingStatuses = usePossibleReadingStatuses();

  if (!session) {
    return (
      <Button disabled icon="plus" {...props} onPress={undefined}>
        Add to library
      </Button>
    );
  }

  const {content} = readingStatusInfo(readingStatus);

  return (
    <View style={style}>
      <Button icon="plus" {...props} style={{marginBottom: -5}}>
        {content}
      </Button>
      <CategoriesCollectionSection
        data={Object.entries(possibleReadingStatuses)}
        renderItem={item => {
          const [value, {title}] = item;
          const readingStatus = value as ReadingStatus;

          return (
            <AddToLibraryChip readingStatus={readingStatus} title={title} />
          );
        }}
      />
    </View>
  );
}

function AddToLibraryChip({
  readingStatus,
  title,
}: {
  readingStatus: ReadingStatus;
  title: string;
}) {
  const {manga} = useMangaDetails();
  const {updateMangaReadingStatus, refreshReadingStatuses} =
    useLibraryContext();
  const currentReadingStatus = useLibraryStatus(manga);
  const [updating, setUpdating] = useState(false);
  const selectedChipColor = useBackgroundColor('primary');

  const onPress = () => {
    setUpdating(true);
    updateMangaReadingStatus!(manga.id, readingStatus).finally(() => {
      refreshReadingStatuses!();
      setUpdating(false);
    });
  };

  const selected = updating || currentReadingStatus === readingStatus;

  return (
    <Chip
      icon="tag"
      selected={selected}
      disabled={updating}
      style={{
        backgroundColor: selected ? selectedChipColor : undefined,
      }}
      onPress={onPress}>
      {title}
    </Chip>
  );
}
