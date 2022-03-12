import React, {useState} from 'react';
import {FormattedDisplayName} from 'react-intl';
import {FlatList, TouchableNativeFeedback, View} from 'react-native';
import {BasicModal, TextBadge} from 'src/components';

interface Props {
  visible: boolean;
  selectedLocales: string[];
  locales: string[];
  onDismiss(): void;
  onSubmit(locales: string[]): void;
}

export default function LocaleSelectionModal({
  locales,
  selectedLocales,
  visible,
  onDismiss,
  onSubmit,
}: Props) {
  const [selected, setSelected] = useState<string[]>(selectedLocales);
  const handleDismiss = () => {
    setSelected(selectedLocales);
    onDismiss();
  };

  const handleSubmit = (selected: string[]) => {
    onSubmit(selected);
    onDismiss();
  };

  return (
    <BasicModal
      visible={visible}
      title="Select a language"
      onDismiss={handleDismiss}
      primaryAction={{content: 'Done', onAction: () => handleSubmit(selected)}}>
      <FlatList
        data={locales}
        renderItem={({item}) => (
          <TouchableNativeFeedback
            onPress={() =>
              setSelected(current =>
                current.includes(item)
                  ? current.filter(x => x !== item)
                  : [...current, item],
              )
            }>
            <View
              style={{
                padding: 15,
              }}>
              <TextBadge
                style={{marginLeft: -5}}
                icon={selected.includes(item) ? 'check' : undefined}
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
