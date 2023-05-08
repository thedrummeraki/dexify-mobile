import React, {useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, RefreshControl, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {
  CoverSize,
  findRelationships,
  mangaImage,
  preferredMangaAuthor,
  preferredMangaTitle,
} from 'src/api';
import {useGetMangaList} from 'src/api/mangadex/hooks';
import {
  BasicResultsResponse,
  ContentRating,
  CustomList,
} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useAuthenticatedDeleteRequest} from 'src/api/utils';
import {Banner, CloseCurrentScreenHeader} from 'src/components';
import {List} from 'src/components/List/List';
import {useDexifyNavigation} from 'src/foundation';
import CustomListActions from './CustomListActions';
import EditingCustomListActions from './EditingCustomListActions';

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
  const navigation = useDexifyNavigation();
  const initialized = useRef(false);
  const [editing, setEditing] = useState(false);

  const ids = useMemo(
    () => findRelationships(customList, 'manga').map(r => r.id),
    [customList],
  );
  const {loading, data} = useGetMangaList(
    {
      ids,
      limit: ids.length,
    },
    true,
  );
  const manga = data?.result === 'ok' ? data.data : [];
  const imageUrl =
    manga.length < 1
      ? 'https://mangadex.org/img/avatar.png'
      : manga.length < 4
      ? mangaImage(manga[0])
      : manga.slice(0, 4).map(manga => mangaImage(manga));

  const [deleteCustomList] =
    useAuthenticatedDeleteRequest<BasicResultsResponse>(
      UrlBuilder.customList(customList.id),
    );

  // const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    if (!initialized.current && data?.result) {
      initialized.current = true;
    }
  }, [data]);

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
  }, [editing, onRefresh]);

  const mangaAsResourceList = manga.map(manga => ({
    id: manga.id,
    title: preferredMangaTitle(manga),
    subtitle: preferredMangaAuthor(manga)?.attributes.name,
    image: {
      url: mangaImage(manga, {size: CoverSize.Small}),
      width: 70,
      blurRadius:
        manga.attributes.contentRating === ContentRating.pornographic
          ? 25
          : undefined,
    },
  }));

  const handleCustomListDelete = () => {
    deleteCustomList().then(response => {
      if (response?.result === 'ok') {
        navigation.goBack();
      }
    });
  };

  const headerMarkup = (
    <>
      {editing ? (
        <EditingCustomListActions
          customList={customList}
          onCustomListUpdate={onCustomListUpdate}
          onEditingDone={() => setEditing(false)}
        />
      ) : (
        <CustomListActions
          customList={customList}
          onEditing={setEditing}
          onDeleted={handleCustomListDelete}
        />
      )}
    </>
  );

  const bodyMarkup = (
    <List
      loading={loading}
      data={ids.length ? mangaAsResourceList : []}
      onItemPress={item => {
        const resource = manga.find(manga => manga.id === item.id)!;
        navigation.push('ShowManga', resource);
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={headerMarkup}
      ListEmptyComponent={
        <Banner
          title="No manga added"
          // primaryAction={{content: 'Browse manga', onAction: () => {}}}
        >
          Looks like this list doesn't any manga yet. You can added add manga to
          this list at any time.
        </Banner>
      }
      itemStyle={{marginHorizontal: 10}}
    />
  );

  return (
    <View style={{flex: 1}}>
      <TextInput dense style={{margin: 15, display: 'none'}} />
      <CloseCurrentScreenHeader title={customList.attributes.name} />
      <View>{bodyMarkup}</View>
    </View>
  );
}
