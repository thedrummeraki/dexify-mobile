import React from 'react';
import {FlatList, TouchableNativeFeedback, View} from 'react-native';
import {Caption, Text} from 'react-native-paper';
import {readingStatusInfo} from 'src/api';
import {
  ReadingStatus,
  ReadingStatusUpdateResponse,
} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useAuthenticatedCallback, usePostRequest} from 'src/api/utils';
import {FullScreenModal, TextBadge} from 'src/components';
import {useMangaDetails} from '../../../ShowMangaDetails';

interface Props {
  visible: boolean;
  loading: boolean;
  readingStatus: ReadingStatus | null | undefined;
  onDismiss(): void;
  onReadingStatusUpdate(readingStatus: ReadingStatus | null | undefined): void;
}

export default function AddToLibraryModal({
  visible,
  loading,
  readingStatus,
  onReadingStatusUpdate,
  onDismiss,
}: Props) {
  const {manga} = useMangaDetails();

  const allReadingStatuses = Object.values(ReadingStatus).map(x =>
    readingStatusInfo(x),
  );

  const [callback] = usePostRequest<ReadingStatusUpdateResponse>(
    UrlBuilder.buildUrl(`/manga/${manga.id}/status`),
  );

  const updateReadingStatus = useAuthenticatedCallback(callback);

  return (
    <FullScreenModal
      visible={visible && !loading}
      title="Add to library..."
      primaryAction={{content: 'Done', onAction: onDismiss}}
      onDismiss={onDismiss}>
      <FlatList
        data={allReadingStatuses}
        renderItem={({item}) => {
          const selected = readingStatus === item.value;

          return (
            <TouchableNativeFeedback
              onPress={() => {
                const status = selected ? null : item.value;

                onReadingStatusUpdate(status);
                Promise.all([updateReadingStatus(undefined, {status})]);
              }}>
              <View
                style={{
                  padding: 15,
                }}>
                <TextBadge
                  style={{marginLeft: -5}}
                  icon={selected ? 'check' : undefined}
                  content={<Text>{item.content}</Text>}
                  background="none"
                />
                <Caption>{item.phrase}</Caption>
              </View>
            </TouchableNativeFeedback>
          );
        }}
      />
    </FullScreenModal>
  );
}
