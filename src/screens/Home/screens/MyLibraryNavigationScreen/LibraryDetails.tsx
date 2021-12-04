import React, {useEffect, useState} from 'react';
import {
  RefreshControl,
  SafeAreaView,
  View,
  ScrollView,
  Keyboard,
} from 'react-native';
import {
  ActivityIndicator,
  Badge,
  Button,
  Caption,
  IconButton,
  TextInput,
  Title,
} from 'react-native-paper';
import {mangaImage} from 'src/api';
import {ContentRating, CustomList, Manga} from 'src/api/mangadex/types';
import BasicList from 'src/components/BasicList';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail, {ThumbnailBadge} from 'src/foundation/Thumbnail';
import {useLibraryContext} from 'src/prodivers';
import {pluralize} from 'src/utils';

interface MangaInList {
  title: string;
  id: string;
  visibility: 'private' | 'public';
  mangaCount: number;
  manga: Manga[];
  mangaId?: string;
}

interface Props {
  mangaInList: MangaInList[];
  refreshing: boolean;
  onRefresh(): void;
}

export default function LibraryDetails({
  mangaInList,
  refreshing,
  onRefresh,
}: Props) {
  const navigation = useDexifyNavigation();
  const [newListNameInput, setNewListName] = useState('');
  const [showAddNewListForm, setShowAddNewListForm] = useState(false);
  const [addingNewList, setAddingNewList] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newCustomList, setNewCustomList] = useState<CustomList>();
  const {createCustomList} = useLibraryContext();

  const newListName = newListNameInput.trim();

  const addNewListState = newListNameInput
    ? `New private list: "${newListName}". This can change later.`
    : 'Add a cool name to your new list.';

  const handleAddNewList = () => {
    setAddingNewList(true);
    createCustomList!({name: newListName})
      .then(result => {
        if (result?.result === 'ok') {
          setNewCustomList(result.data);
          navigation.push('ShowCustomList', {id: result.data.id});
        }
        setAddingNewList(false);
      })
      .then(handleCancel)
      .then(onRefresh)
      .catch(error => {
        console.error(error);
        setAddingNewList(false);
      });
  };

  const handleCancel = () => {
    if (addingNewList) {
      return;
    }
    setShowAddNewListForm(false);
    setNewListName('');
  };

  useEffect(() => {
    const unsubscribe = Keyboard.addListener('keyboardDidHide', handleCancel);

    return () => unsubscribe.remove();
  }, []);

  const addNewListMarkup = (
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
          disabled={addingNewList}
          value={newListNameInput}
          onChangeText={setNewListName}
          placeholder="Your new list..."
          mode="outlined"
          style={{flex: 1}}
        />
        {addingNewList ? (
          <ActivityIndicator style={{marginLeft: 24}} />
        ) : (
          <IconButton
            disabled={!newListName}
            onPress={handleAddNewList}
            icon="check"
          />
        )}
        <IconButton onPress={handleCancel} icon="close" />
      </View>
      <Caption>{addNewListState}</Caption>
    </View>
  );
  const normalHeaderHeader = (
    <View
      style={{
        marginHorizontal: 15,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Title>{refreshing ? 'Refreshing...' : 'Your library'}</Title>
      <IconButton
        disabled={refreshing}
        onPress={() => setShowAddNewListForm(true)}
        icon="plus"
      />
    </View>
  );
  const headerMarkup = showAddNewListForm
    ? addNewListMarkup
    : normalHeaderHeader;

  return (
    <SafeAreaView style={{flex: 1}}>
      {headerMarkup}
      <ScrollView
        style={{
          flex: 1,
          margin: 10,
          marginBottom: 0,
          opacity: showAddNewListForm ? 0.4 : 1,
        }}
        refreshControl={
          <RefreshControl
            enabled
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <BasicList
          data={mangaInList}
          aspectRatio={1 / 2}
          itemStyle={{padding: 5, marginBottom: 5}}
          renderItem={item => (
            <SelectableThumbnail
              item={item}
              selected={selectedIds.includes(item.id)}
              selectOnPress={selectedIds.length > 0}
              onItemSelected={id => {
                setSelectedIds([id]);
              }}
              onItemUnselected={() => setSelectedIds([])}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SelectableThumbnail({
  item,
  selected,
  selectOnPress,
  onItemUnselected,
  onItemSelected,
}: {
  item: MangaInList;
  selected: boolean;
  selectOnPress: boolean;
  onItemUnselected?(id: string): void;
  onItemSelected(id: string): void;
}) {
  const navigation = useDexifyNavigation();
  const imageUrl =
    item.manga.length < 1
      ? 'https://mangadex.org/avatar.png'
      : item.manga.map(manga => mangaImage(manga));

  useEffect(() => {
    if (selected) {
      onItemSelected(item.id);
    }
  }, [selected]);

  const visibilityBadge =
    item.visibility === 'private' ? (
      <ThumbnailBadge>Private</ThumbnailBadge>
    ) : undefined;

  return (
    <Thumbnail
      TopComponent={visibilityBadge}
      imageUrl={imageUrl}
      width="100%"
      aspectRatio={1}
      title={item.title}
      subtitle={pluralize(item.mangaCount, 'entry', {
        plural: 'entries',
      })}
      border={selected ? {} : undefined}
      onPress={() => {
        if (selected) {
          onItemUnselected?.(item.id);
        } else if (selectOnPress) {
          onItemSelected(item.id);
        } else {
          console.log('HA nope', selected, selectOnPress);
          // navigation.push('ShowMangaList', {
          //   params: {
          //     ids: item.manga.map(m => m.id),
          //     contentRating: Object.values(ContentRating),
          //   },
          // });
          navigation.push('ShowCustomList', {id: item.id});
        }
      }}
      onLongPress={() =>
        selected ? onItemUnselected?.(item.id) : onItemSelected(item.id)
      }
    />
  );
}
