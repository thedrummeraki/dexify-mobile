import React, {useEffect, useMemo, useState} from 'react';
import {BackHandler, RefreshControl, ScrollView, View} from 'react-native';
import {
  ActivityIndicator,
  Caption,
  IconButton,
  Switch,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';
import {findRelationships} from 'src/api';
import {ContentRating, CustomList} from 'src/api/mangadex/types';
import {Banner, MangaSearchCollection, TextBadge} from 'src/components';
import {BackgroundColor, useBackgroundColor} from 'src/components/colors';
import {MangaCollectionDisplay} from 'src/components/MangaSearchCollection/MangaSearchCollection';
import {useLibraryContext} from 'src/prodivers';

interface Props {
  customList: CustomList;
  refreshing: boolean;
  onRefresh(): void;
  onCustomListUpdate(customList: CustomList): void;
}

export default function ShowCustomListDetails({
  customList,
  refreshing,
  onRefresh,
  onCustomListUpdate,
}: Props) {
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (editing) {
          setEditing(false);
          return true;
        } else {
          onRefresh();
        }
      },
    );

    return () => unsubscribe.remove();
  }, [editing]);

  const ids = useMemo(
    () => findRelationships(customList, 'manga').map(r => r.id),
    [customList],
  );

  const bodyMarkup = ids.length ? (
    <MangaSearchCollection
      display={MangaCollectionDisplay.List}
      filterOptions={{placeholder: 'Filter manga...'}}
      HeaderComponentStyle={{margin: 5, marginTop: 0}}
      options={{
        ids,
        limit: ids.length,
        contentRating: Object.values(ContentRating),
      }}
    />
  ) : (
    <Banner
      title="No manga added"
      primaryAction={{content: 'Browse manga', onAction: () => {}}}>
      Looks like this list doesn't any manga yet. You can added add manga to
      this list at any time.
    </Banner>
  );

  return (
    <>
      <Header
        customList={customList}
        editing={editing}
        onEditing={setEditing}
        onCustomListUpdate={onCustomListUpdate}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          opacity: editing ? 0.4 : 1,
        }}>
        {bodyMarkup}
      </ScrollView>
    </>
  );
}

function Header({
  customList,
  editing,
  onEditing,
  onCustomListUpdate,
}: {
  customList: CustomList;
  editing: boolean;
  onEditing(editing: boolean): void;
  onCustomListUpdate(customList: CustomList): void;
}) {
  if (!editing) {
    return (
      <InfoHeader customList={customList} onEditing={() => onEditing(true)} />
    );
  }

  return (
    <EditingHeader
      customList={customList}
      onEditingDone={() => onEditing(false)}
      onCustomListUpdate={onCustomListUpdate}
    />
  );
}

function EditingHeader({
  customList,
  onEditingDone,
  onCustomListUpdate,
}: {
  customList: CustomList;
  onEditingDone(): void;
  onCustomListUpdate(customList: CustomList): void;
}) {
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
    <View
      style={{
        marginHorizontal: 15,
        paddingTop: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TextInput
          dense
          autoFocus
          disabled={updating}
          value={inputName}
          onChangeText={setInputName}
          placeholder="Your new list..."
          mode="outlined"
          style={{flex: 1}}
        />
        {updating ? (
          <ActivityIndicator style={{marginLeft: 24}} />
        ) : (
          <IconButton
            disabled={updating || !dirty}
            onPress={handleSubmit}
            icon="content-save"
          />
        )}
        <IconButton onPress={onEditingDone} icon="close" />
      </View>
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
    </View>
  );
}

function InfoHeader({
  customList,
  onEditing,
}: {
  customList: CustomList;
  onEditing(): void;
}) {
  const visibilityInfo =
    customList.attributes.visibility === 'private'
      ? {
          name: 'Private',
          background: 'error',
        }
      : {
          name: 'Public',
          background: 'accent',
        };

  return (
    <View
      style={{
        marginHorizontal: 15,
        paddingTop: 10,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View>
        <Title>{customList.attributes.name}</Title>
        <View style={{flexDirection: 'row'}}>
          <TextBadge
            content={visibilityInfo.name}
            background={visibilityInfo.background as BackgroundColor}
          />
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <IconButton onPress={onEditing} icon="plus" />
        <IconButton onPress={onEditing} icon="pencil-outline" />
      </View>
    </View>
  );
}
