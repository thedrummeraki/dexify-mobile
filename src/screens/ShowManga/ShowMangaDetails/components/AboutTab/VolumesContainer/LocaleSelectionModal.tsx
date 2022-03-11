import React from 'react';
import {FormattedDisplayName} from 'react-intl';
import {FlatList, TouchableNativeFeedback, View} from 'react-native';
import {BasicModal, TextBadge} from 'src/components';

interface Props {
  visible: boolean;
  locales: string[];
  onDismiss(): void;
}

export default function LocaleSelectionModal({
  locales,
  visible,
  onDismiss,
}: Props) {
  return (
    <BasicModal
      visible={visible}
      title="Select a language"
      onDismiss={onDismiss}>
      <FlatList
        data={locales}
        renderItem={({item}) => (
          <TouchableNativeFeedback onPress={() => {}}>
            <View
              style={{
                padding: 15,
              }}>
              <TextBadge
                style={{marginLeft: -5}}
                content={<FormattedDisplayName value={item} type="language" />}
                background="none"
              />
            </View>
          </TouchableNativeFeedback>
        )}
      />
    </BasicModal>
  );
}
