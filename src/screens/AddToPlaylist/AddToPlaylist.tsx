import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Caption,
  Searchbar,
  Snackbar,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';
import {CoverSize, mangaImage, preferredMangaTitle} from 'src/api';
import {CustomList, PagedResultsList} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {CloseCurrentScreenHeader} from 'src/components';
import BasicList from 'src/components/BasicList';
import {List} from 'src/components/List/List';
import MangaThumbnail from 'src/components/MangaThumbnail';
import {useAddToPlaylistRoute, useDexifyNavigation} from 'src/foundation';
import Thumbnail from 'src/foundation/Thumbnail';
import {useLibraryContext} from 'src/prodivers';
import {pluralize} from 'src/utils';
import {useCustomListInfo} from '../Home/screens/MyLibraryNavigationScreen/MyLibraryNavigationScreen';

export default function AddToPlaylist() {
  const route = useAddToPlaylistRoute();
  const {manga} = route.params;

  const [addingSuccessful, setAddingSuccessful] = useState(false);
  const [updateState, setUpdateState] = useState({
    loading: false,
    message: `Select a list to add ${preferredMangaTitle(manga)} to.`,
  });
  const [snackVisible, setSnackVisible] = useState(false);

  const requestInitiated = useRef(false);

  const [filterQuery, setFilterQuery] = useState('');
  const handleFilterQuery = useCallback((value: string) => {
    setFilterQuery(value.trim());
  }, []);

  const {customListInfo} = useCustomListInfo();

  const {addMangaToCustomList} = useLibraryContext();
  const customLists = useMemo(() => {
    if (!customListInfo) {
      return [];
    }

    const allLists = customListInfo.map(info => ({
      id: info.customList.id,
      customList: info.customList,
      manga: info.manga,
    }));

    return allLists.filter(
      list =>
        !filterQuery ||
        list.customList.attributes.name
          .toLocaleLowerCase()
          .includes(filterQuery.toLocaleLowerCase()),
    );
  }, [customListInfo, filterQuery]);

  useEffect(() => {
    setAddedLists(
      customLists
        .filter(info => info.manga.map(m => m.id).includes(manga.id))
        .map(l => l.id),
    );
  }, [customLists]);

  const [addedToLists, setAddedLists] = useState<string[]>([]);

  const handleAddMangaToList = useCallback(
    (list: CustomList) => {
      setUpdateState({loading: true, message: 'Adding to list...'});
      addMangaToCustomList!(list.id, manga.id)
        .then(response => {
          setAddingSuccessful(response?.result === 'ok');
          if (response?.result === 'ok') {
            setAddedLists(lists => {
              if (!lists.includes(list.id)) {
                lists.push(list.id);
              }
              return lists;
            });
          }
        })
        .catch(console.error)
        .finally(() =>
          setUpdateState({
            loading: false,
            message: 'Continue adding to other lists.',
          }),
        );
    },
    [manga],
  );

  useEffect(() => {
    if (!updateState.loading && requestInitiated.current) {
      setSnackVisible(true);
      requestInitiated.current = false;
    } else if (updateState.loading) {
      requestInitiated.current = true;
    }
  }, [updateState.loading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSnackVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [snackVisible]);

  return (
    <View style={{flex: 1}}>
      <CloseCurrentScreenHeader
        title={
          updateState.loading ? updateState.message : preferredMangaTitle(manga)
        }
      />

      <ScrollView>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <Thumbnail imageUrl={mangaImage(manga)} width={200} aspectRatio={1} />
        </View>
        <View style={{margin: 15, marginBottom: 0}}>
          <Text>{updateState.message}</Text>
          <Caption style={{lineHeight: 16}}>
            Keep in mind that there may be a small delay to show updated results
            throughout the app.
          </Caption>
        </View>
        <TextInput
          dense
          value={filterQuery}
          onChangeText={handleFilterQuery}
          placeholder="Filter by name..."
          style={{marginHorizontal: 0, marginTop: 10}}
        />
        <BasicList
          data={customLists}
          aspectRatio={1}
          itemStyle={{paddingHorizontal: 15}}
          renderItem={item => {
            const imageUrl =
              item.manga.length < 1
                ? 'https://mangadex.org/avatar.png'
                : item.manga.slice(0, 1).map(manga => mangaImage(manga))[0];

            return (
              <List.Item
                selected={addedToLists.includes(item.customList.id)}
                title={item.customList.attributes.name}
                subtitle={pluralize(item.manga.length, 'title')}
                image={{url: imageUrl, width: 70}}
                onPress={() => handleAddMangaToList(item.customList)}
              />
            );
          }}
        />
      </ScrollView>
      <Snackbar visible={snackVisible} onDismiss={() => {}}>
        {addingSuccessful
          ? 'Manga was added!'
          : "Oops, something didn't go right..."}
      </Snackbar>
    </View>
  );
}
