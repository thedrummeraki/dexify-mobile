import React, {useCallback, useMemo, useState} from 'react';
import {ScrollView, Text, TouchableNativeFeedback, View} from 'react-native';
import {Caption, Chip, TextInput, useTheme} from 'react-native-paper';
import CategoriesCollectionSection from './CategoriesCollection/CategoriesCollectionSection';

interface Resource {
  id: string;
  name: string;
  description?: string;
}

interface Props<T extends Resource> {
  values: T[];
  selected?: T[];
  multiple?: boolean;
  onPress?(value: T[]): void;
}

interface DropdownItemProps<T extends Resource> {
  value: T;
  selected: boolean;
  onPress(value: T): void;
}

export default function SimpleInputDropdown<T extends Resource>({
  values,
  selected,
  multiple,
  onPress,
}: Props<T>) {
  const [expanded, setExpanded] = useState(false);
  const [selectedItems, setSelectedItems] = useState<T[]>(selected || []);
  const [input, setInput] = useState('');

  const selectedIds = useMemo(
    () => selectedItems.map(selected => selected.id),
    [selectedItems],
  );

  const filteredValues = useMemo(() => {
    if (!input) {
      return values;
    }

    return values.filter(value =>
      [value.name, value.description || '']
        .map(value => value.toLocaleLowerCase())
        .includes(input.toLocaleLowerCase()),
    );
  }, [values, input]);

  const handleOnPress = useCallback(
    (value: T) => {
      if (selectedIds.includes(value.id)) {
        setSelectedItems(current =>
          current.filter(currentItem => currentItem.id !== value.id),
        );
      } else {
        setSelectedItems(current => [...current, value]);
      }
    },
    [selectedIds],
  );

  const toggleExpanded = () => setExpanded(expanded => !expanded);

  return (
    <View style={{position: 'relative'}}>
      <TextInput
        dense
        mode="outlined"
        value={input}
        onChangeText={setInput}
        right={<TextInput.Icon name="chevron-down" onPress={toggleExpanded} />}
        render={props => (
          <View style={{marginTop: -5, marginBottom: 7, marginHorizontal: 5}}>
            <CategoriesCollectionSection
              data={selectedItems}
              renderItem={item => {
                return <Chip>{item.name}</Chip>;
              }}
            />
          </View>
        )}
      />
      {expanded ? (
        <ScrollView nestedScrollEnabled style={{zIndex: 10, maxHeight: 200}}>
          {filteredValues.map(value => {
            return (
              <DropdownItem
                key={value.id}
                value={value}
                selected={selectedIds.includes(value.id)}
                onPress={handleOnPress}
              />
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}

function DropdownItem<T extends Resource>({
  value,
  selected,
  onPress,
}: DropdownItemProps<T>) {
  const theme = useTheme();
  return (
    <TouchableNativeFeedback onPress={() => onPress(value)}>
      <View style={{backgroundColor: theme.colors.background, padding: 15}}>
        <Text>
          {value.name} {selected && '*'}
        </Text>
        {value.description && <Caption>{value.description}</Caption>}
      </View>
    </TouchableNativeFeedback>
  );
}
