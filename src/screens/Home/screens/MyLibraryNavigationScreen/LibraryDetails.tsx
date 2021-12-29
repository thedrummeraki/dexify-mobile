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
import {findRelationships, mangaImage} from 'src/api';
import {ContentRating, CustomList, Manga} from 'src/api/mangadex/types';
import BasicList from 'src/components/BasicList';
import {useBackgroundColor} from 'src/components/colors';
import {List} from 'src/components/List/List';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail, {
  ThumbnailBadge,
  ThumbnailSkeleton,
} from 'src/foundation/Thumbnail';
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
  customLists: CustomList[];
  refreshing: boolean;
  onRefresh(): void;
}

export default function LibraryDetails({
  customLists,
  refreshing,
  onRefresh,
}: Props) {
  const navigation = useDexifyNavigation();
  const [newListNameInput, setNewListName] = useState('');
  const [showAddNewListForm, setShowAddNewListForm] = useState(false);
  const [addingNewList, setAddingNewList] = useState(false);
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
        marginLeft: 15,
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
        marginLeft: 15,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Title>{refreshing ? 'Refreshing...' : 'Your MDLists'}</Title>
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
      <List
        loading={refreshing}
        data={customLists.map(customList => ({
          id: customList.id,
          title: customList.attributes.name,
          subtitle: pluralize(
            findRelationships(customList, 'manga').length,
            'title',
          ),
          image: {url: 'https://mangadex.org/avatar.png', width: 70},
        }))}
        onItemPress={item => navigation.push('ShowCustomList', {id: item.id})}
        refreshControl={
          <RefreshControl
            enabled
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{marginHorizontal: 10}}
      />
    </SafeAreaView>
  );
}
