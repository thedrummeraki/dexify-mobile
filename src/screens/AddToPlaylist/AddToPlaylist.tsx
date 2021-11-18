import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Searchbar,
  Snackbar,
  Title,
} from 'react-native-paper';
import {CoverSize, mangaImage, preferredMangaTitle} from 'src/api';
import {CustomList, PagedResultsList} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import BasicList from 'src/components/BasicList';
import MangaThumbnail from 'src/components/MangaThumbnail';
import {useAddToPlaylistRoute, useDexifyNavigation} from 'src/foundation';
import Thumbnail from 'src/foundation/Thumbnail';
import {useLibraryContext} from 'src/prodivers';

export default function AddToPlaylist() {
  const route = useAddToPlaylistRoute();
  const [updateState, setUpdateState] = useState({
    loading: false,
    message: 'Add to list',
  });
  const [snackVisible, setSnackVisible] = useState(false);

  const requestInitiated = useRef(false);

  const {manga} = route.params;

  const [filterQuery, setFilterQuery] = useState('');
  const handleFilterQuery = useCallback((value: string) => {
    setFilterQuery(value.trim());
  }, []);

  const {customListInfo, refreshCustomLists, addMangaToCustomList} =
    useLibraryContext();
  const customLists = useMemo(() => {
    if (!customListInfo) {
      return [];
    }

    const allLists = customListInfo
      .map(info => ({
        id: info.customList.id,
        customList: info.customList,
        manga: info.manga,
      }))
      .filter(info => !info.manga.map(m => m.id).includes(manga.id));

    return allLists.filter(
      list =>
        !filterQuery ||
        list.customList.attributes.name
          .toLocaleLowerCase()
          .includes(filterQuery.toLocaleLowerCase()),
    );
  }, [customListInfo, filterQuery]);

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
      <View
        style={{
          paddingHorizontal: 10,
          paddingBottom: 10,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        {updateState.loading ? <ActivityIndicator /> : undefined}
        <Title style={{textAlign: 'center', marginLeft: 10}}>
          {updateState.message}
        </Title>
      </View>
      <Searchbar
        value={filterQuery}
        onChangeText={handleFilterQuery}
        placeholder="Filter by name..."
      />

      <ScrollView>
        <BasicList
          data={customLists}
          aspectRatio={1 / 3}
          renderItem={item => {
            const imageUrl =
              item.manga.length < 1
                ? 'https://mangadex.org/avatar.png'
                : item.manga.map(manga => mangaImage(manga));

            return (
              <Thumbnail
                imageUrl={imageUrl}
                width="100%"
                aspectRatio={1}
                title={item.customList.attributes.name}
                onPress={() => {
                  setUpdateState({loading: true, message: 'Adding to list...'});
                  addMangaToCustomList!(item.customList.id, manga.id)
                    .then(() => {
                      setUpdateState(state => ({
                        ...state,
                        message: 'Refreshing lists...',
                      }));

                      return refreshCustomLists!();
                    })
                    .catch(console.error)
                    .finally(() =>
                      setUpdateState({
                        loading: false,
                        message: 'Add to list',
                      }),
                    );
                }}
              />
            );
          }}
        />
      </ScrollView>
      <Snackbar visible={snackVisible} onDismiss={() => {}}>
        Manga was added!
      </Snackbar>
    </View>
  );
}
