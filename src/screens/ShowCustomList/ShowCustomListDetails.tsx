import React, {useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, RefreshControl, ScrollView, View} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import {
  CoverSize,
  findRelationship,
  findRelationships,
  mangaImage,
  preferredMangaAuthor,
  preferredMangaTitle,
} from 'src/api';
import {useGetMangaList} from 'src/api/mangadex/hooks';
import {Artist, Author, CustomList} from 'src/api/mangadex/types';
import {
  Banner,
  CloseCurrentScreenHeader,
  HiddenMangaBanner,
} from 'src/components';
import BasicList from 'src/components/BasicList';
import {List} from 'src/components/List/List';
import {MangaListItem} from 'src/components/MangaSearchCollection/MangaListItem';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail, {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
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
  const {loading, data} = useGetMangaList({
    ids,
    limit: ids.length,
  });
  const manga = data?.result === 'ok' ? data.data : [];
  const imageUrl =
    manga.length < 1
      ? 'https://mangadex.org/avatar.png'
      : manga.length < 4
      ? mangaImage(manga[0])
      : manga.slice(0, 4).map(manga => mangaImage(manga));

  // const [filterQuery, setFilterQuery] = useState('');

  const thumbnailMarkup =
    ids.length > 0 ? (
      loading || !initialized.current ? (
        <ThumbnailSkeleton width={200} height={200} />
      ) : (
        <Thumbnail imageUrl={imageUrl} width={200} aspectRatio={1} />
      )
    ) : (
      <Thumbnail
        imageUrl="https://mangadex.org/avatar.png"
        width={200}
        aspectRatio={1}
      />
    );

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
    },
  }));

  const bodyMarkup =
    ids.length || loading ? (
      <List
        loading={loading}
        data={mangaAsResourceList}
        onItemPress={item => {
          const resource = manga.find(manga => manga.id === item.id)!;
          navigation.push('ShowManga', resource);
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
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
              />
            )}
          </>
        }
        itemStyle={{marginHorizontal: 10}}
      />
    ) : !loading ? (
      <Banner
        title="No manga added"
        primaryAction={{content: 'Browse manga', onAction: () => {}}}>
        Looks like this list doesn't any manga yet. You can added add manga to
        this list at any time.
      </Banner>
    ) : null;

  return (
    <>
      <TextInput dense style={{margin: 15, display: 'none'}} />
      <CloseCurrentScreenHeader title={customList.attributes.name} />
      {bodyMarkup}
    </>
  );
}
