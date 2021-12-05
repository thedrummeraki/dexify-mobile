import React, {useEffect, useMemo, useState} from 'react';
import {Switch, Text, View} from 'react-native';
import {Caption, Button, TextInput, useTheme} from 'react-native-paper';
import {CustomList} from 'src/api/mangadex/types';
import {useBackgroundColor} from 'src/components/colors';
import {useLibraryContext} from 'src/prodivers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  customList: CustomList;
  onCustomListUpdate(customList: CustomList): void;
  onEditingDone(): void;
}

export default function EditingCustomListActions({
  customList,
  onCustomListUpdate,
  onEditingDone,
}: Props) {
  const theme = useTheme();
  const [dirty, setDirty] = useState(false);
  const [state, setState] = useState<CustomList.UpdateParams>({});
  const [updating, setUpdating] = useState(false);

  const originalState: CustomList.UpdateParams = useMemo(
    () => ({
      name: customList.attributes.name,
      visibility: customList.attributes.visibility,
    }),
    [customList],
  );

  const [inputName, setInputName] = useState(customList.attributes.name);
  const [visibility, setVisibility] = useState<CustomList.Visibility>(
    customList.attributes.visibility,
  );

  const reset = () => {
    setVisibility(customList.attributes.visibility);
    setInputName(customList.attributes.name);
  };

  const {updateCustomList} = useLibraryContext();
  const handleSubmit = () => {
    if (dirty) {
      setUpdating(true);
      updateCustomList!(customList, state)
        .then(response => {
          if (response?.result === 'ok') {
            console.log('[INFO] custom list updated to', response.data);
            onCustomListUpdate(response.data);
            onEditingDone();
          } else if (response?.result === 'error') {
            console.error(response.result);
            reset();
          }
        })
        .catch(error => {
          console.error(error);
          reset();
        })
        .finally(() => setUpdating(false));
    } else {
      console.log('[INFO] refusing to update custom list.');
    }
  };

  const visibilityStateColor = useBackgroundColor(
    visibility === 'private' ? 'error' : 'accent',
  );

  const cancelColor = useBackgroundColor('error');

  useEffect(() => {
    setState(state => ({...state, name: inputName.trim()}));
  }, [inputName]);

  useEffect(() => {
    setState(state => ({...state, visibility}));
  }, [visibility]);

  useEffect(() => {
    setDirty(
      state.name !== originalState.name ||
        state.visibility !== originalState.visibility,
    );
  }, [state, originalState]);

  return (
    <View style={{marginHorizontal: 15, marginBottom: 20}}>
      <TextInput
        dense
        disabled={updating}
        value={inputName}
        onChangeText={setInputName}
        placeholder="Hey, hey!! You need a title."
        mode="outlined"
        style={{flex: 1}}
      />
      <View
        style={{
          paddingVertical: 10,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View>
          <Text
            onPress={() => {
              setVisibility(visibility =>
                visibility === CustomList.Visibility.Public
                  ? CustomList.Visibility.Private
                  : CustomList.Visibility.Public,
              );
            }}>
            Set visibility to "public"
          </Text>
          <Caption style={{marginTop: -3, color: visibilityStateColor}}>
            This list will{' '}
            {state.visibility === customList.attributes.visibility
              ? 'remain'
              : 'become'}{' '}
            {visibility} after saving.
          </Caption>
        </View>
        <Switch
          value={visibility === 'public'}
          onValueChange={value => {
            setVisibility(
              value
                ? CustomList.Visibility.Public
                : CustomList.Visibility.Private,
            );
          }}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Button
          compact
          mode="contained"
          disabled={updating || !dirty}
          icon="content-save"
          onPress={handleSubmit}>
          Save
        </Button>
        <Button
          compact
          icon="close"
          style={{marginLeft: 5}}
          onPress={onEditingDone}>
          Cancel
        </Button>
      </View>
    </View>
  );
}
