import React, {useEffect, useMemo, useState} from 'react';
import {View, Keyboard, FlatList} from 'react-native';
import {
  ActivityIndicator,
  Caption,
  IconButton,
  TextInput,
  Title,
} from 'react-native-paper';
import {findRelationships} from 'src/api';
import {ContentRating, CustomList, Manga} from 'src/api/mangadex/types';
import {useDexifyNavigation} from 'src/foundation';
import {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {useLibraryContext} from 'src/prodivers';
import {useDimensions} from 'src/utils';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {useLazyGetMangaList} from 'src/api/mangadex/hooks';
import MangaThumbnail from 'src/components/MangaThumbnail';

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

export default function MDListsDetails({
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

  const mangaIds = useMemo(() => {
    return customLists
      .map(customList => {
        return findRelationships(customList, 'manga').map(r => r.id);
      })
      .flat();
  }, [customLists]);

  const [manga, setManga] = useState<Manga[]>([]);
  const [fetchMangaList, {loading}] = useLazyGetMangaList();

  const customListMangaMapping = useMemo(() => {
    console.log('updating mapping...');
    return customLists.map(customList => {
      const mangaRelationships = customList.relationships.filter(
        r => r.type === 'manga',
      );
      return {
        customList,
        mangaCount: mangaRelationships.length,
        manga: manga.filter(manga =>
          mangaRelationships.find(relationship => relationship.id == manga.id),
        ),
      };
    });
  }, [customLists, manga]);

  const dimensions = useDimensions();
  const thumbnailWidth = dimensions.width / 3 - 5 * 3;

  useEffect(() => {
    fetchMangaList({
      ids: mangaIds,
      limit: 100,
      contentRating: Object.values(ContentRating),
    }).then(result => {
      if (result?.result === 'ok') {
        setManga(result.data);
      }
    });
  }, [mangaIds]);

  const addNewListState = newListNameInput
    ? `New private list: "${newListName}". This can change later.`
    : 'Add a cool name to your new list.';

  const handleAddNewList = () => {
    console.log('add new list');
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
    console.log('cancel new list');
    if (addingNewList) {
      return;
    }
    setShowAddNewListForm(false);
    setNewListName('');
  };

  // useEffect(() => {
  //   const unsubscribe = Keyboard.addListener('keyboardDidHide', handleCancel);

  //   return () => unsubscribe.remove();
  // }, []);

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
    <FlatList
      ListHeaderComponent={headerMarkup}
      data={customListMangaMapping}
      renderItem={({item: mapping}) => {
        const {customList, manga} = mapping;

        return (
          <CategoriesCollectionSection
            loading={loading}
            title={customList.attributes.name}
            data={manga}
            dimensions={{width: 120, height: 160}}
            viewMore={{
              content: 'View',
              onAction: () => {
                navigation.push('ShowCustomList', {id: customList.id});
              },
            }}
            renderItem={(manga, dimensions) => (
              <MangaThumbnail
                manga={manga}
                aspectRatio={0.75}
                width={dimensions.size || dimensions.width!}
                height={dimensions.size || dimensions.height!}
              />
            )}
            SkeletonItem={
              <ThumbnailSkeleton height={160} width={thumbnailWidth} />
            }
          />
        );
      }}
    />
  );

  // return (
  //   <List
  //     loading={refreshing}
  //     style={{marginBottom: 80}}
  //     data={customLists.map(customList => ({
  //       id: customList.id,
  //       title: customList.attributes.name,
  //       subtitle: pluralize(
  //         findRelationships(customList, 'manga').length,
  //         'title',
  //       ),
  //       image: {url: 'https://mangadex.org/img/avatar.png', width: 70},
  //     }))}
  //     onItemPress={item => navigation.push('ShowCustomList', {id: item.id})}
  //     refreshControl={
  //       <RefreshControl enabled refreshing={refreshing} onRefresh={onRefresh} />
  //     }
  //     contentContainerStyle={{marginHorizontal: 10}}
  //   />
  // );
}

// function CustomListPreviewSection({customList}: {customList: CustomList}) {
//   const dimensions = useDimensions();
//   const width = dimensions.width / 3 - 5 * 3;

//   const ids = useMemo(
//     () => findRelationships(customList, 'manga').map(r => r.id),
//     [customList],
//   );

//   useEffect(() => {
//     if (ids.length) {
//       // fetchMangaList({
//       //   ids,
//       //   limit: 10,
//       //   contentRating: Object.values(ContentRating),
//       // }).then(result => {
//       //   if (result?.result === 'ok') {
//       //     setManga(result.data);
//       //   }
//       // });
//     } else {
//       setManga([]);
//     }
//   }, [ids]);

// return (
//   <CategoriesCollectionSection
//     loading={loading}
//     title={customList.attributes.name}
//     data={data?.result === 'ok' ? data.data : []}
//     renderItem={manga => (
//       <MangaThumbnail manga={manga} height={160} width={width} />
//     )}
//     SkeletonItem={<ThumbnailSkeleton height={160} width={width} />}
//   />
// );
// }
