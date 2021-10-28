import React from 'react';
import {ViewStyle} from 'react-native';
import {Button} from 'react-native-paper';
import {readingStatusInfo} from 'src/api';
import {ReadingStatusResponse} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {useMangaDetails} from '../../ShowMangaDetails';

type ButtonProps = React.ComponentProps<typeof Button>;
type Props = Omit<ButtonProps, 'children'>;

export default function LibraryButton({...props}: Props) {
  const {manga} = useMangaDetails();

  const {data, loading, error} = useGetRequest<ReadingStatusResponse>(
    `https://api.mangadex.org/manga/${manga.id}/status`,
  );

  if (loading) {
    return (
      <Button loading {...props}>
        {''}
      </Button>
    );
  }

  if (data?.result === 'ok' && data.status) {
    const {content} = readingStatusInfo(data.status);
    return (
      <Button icon="check" {...props}>
        {content}
      </Button>
    );
  }

  if (error || data?.result === 'error') {
    return null;
  }

  return (
    <Button icon="plus" {...props}>
      Add to library
    </Button>
  );
}
