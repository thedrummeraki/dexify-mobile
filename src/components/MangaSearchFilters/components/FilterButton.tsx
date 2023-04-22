import React, {useCallback, useState} from 'react';
import {FlatList, Text, TouchableNativeFeedback, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FullScreenModal, TextBadge} from 'src/components';
import BasicModal from 'src/components/BasicModal';

export function FilterButton<T>({
  values,
  currentValues,
  multiple,
  name,
  icon,
  getName,
  compare,
  onApply,
  onDismiss,
  onSelectionChange,
}: {
  values: T[];
  currentValues: T[] | undefined;
  name: string;
  multiple?: boolean;
  icon?: string;
  getName?: (value: T) => string;
  compare?: (a: T, b: T) => number;
  onApply: (values: T[]) => void;
  onSelectionChange?: (value: T[]) => void;
  onDismiss: () => void;
}) {
  const selectedValues = currentValues || [];

  const {
    colors: {surface: background},
  } = useTheme();
  const [visible, setVisible] = useState(false);
  const handleDismiss = useCallback(() => {
    onDismiss();
    setVisible(false);
  }, []);

  const handleApply = useCallback((values: T[]) => {
    onApply(values);
    setVisible(false);
  }, []);

  const itemSelected = useCallback(
    (item: T) => {
      if (compare) {
        return selectedValues.filter(x => compare(item, x) === 0).length > 0;
      } else {
        return selectedValues.includes(item);
      }
    },
    [selectedValues, compare],
  );

  return (
    <TouchableNativeFeedback
      useForeground
      onPress={() => setVisible(true)}
      background={TouchableNativeFeedback.Ripple('#fff', true)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: background,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 50,
        }}>
        <Text style={{lineHeight: 20, fontSize: 10}}>{name}</Text>
        {icon ? (
          <Icon
            name={icon}
            style={{fontSize: 18, color: '#fff', marginLeft: 5}}
          />
        ) : null}
        <BasicModal
          visible={visible}
          title={name}
          onDismiss={handleDismiss}
          primaryAction={{
            content: 'Apply',
            onAction: () => handleApply(selectedValues),
          }}>
          <FlatList
            data={values}
            renderItem={({item}) => {
              const selected = itemSelected(item);

              return (
                <TouchableNativeFeedback
                  onPress={() => {
                    if (selected) {
                      onSelectionChange?.(
                        selectedValues.filter(x => item !== x),
                      );
                    } else {
                      onSelectionChange?.([...selectedValues, item]);
                    }
                  }}>
                  <View
                    style={{
                      padding: 15,
                    }}>
                    <TextBadge
                      style={{marginLeft: -5}}
                      icon={selected ? 'check' : undefined}
                      content={<Text>{getName?.(item) || String(item)}</Text>}
                      background="none"
                    />
                  </View>
                </TouchableNativeFeedback>
              );
            }}
          />
        </BasicModal>
      </View>
    </TouchableNativeFeedback>
  );
}
