import React, {useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, RefreshControl, ScrollView, View} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import {findRelationships, mangaImage} from 'src/api';
import {useGetMangaList} from 'src/api/mangadex/hooks';
import {CustomList} from 'src/api/mangadex/types';
import {
  Banner,
  CloseCurrentScreenHeader,
  HiddenMangaBanner,
} from 'src/components';
import BasicList from 'src/components/BasicList';
import {MangaListItem} from 'src/components/MangaSearchCollection/MangaListItem';
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
  const initialized = useRef(false);
  const scrollViewRef = useRef<ScrollView | null>();
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

  const bodyMarkup = ids.length ? (
    <BasicList
      loading={loading}
      aspectRatio={1}
      data={manga}
      style={{marginHorizontal: 10}}
      itemStyle={{padding: 5}}
      renderItem={item => <MangaListItem manga={item} />}
      skeletonLength={ids.length}
      skeletonItem={<MangaListItem.Skeleton />}
      HeaderComponentStyle={{margin: 5, marginTop: 0}}
      ListEmptyComponent={<Text>Empty!</Text>}
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
      {/* <Header
        customList={customList}
        editing={editing}
        onEditing={setEditing}
        onCustomListUpdate={onCustomListUpdate}
      /> */}
      <TextInput dense style={{margin: 15, display: 'none'}} />
      <ScrollView
        ref={ref => (scrollViewRef.current = ref)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <CloseCurrentScreenHeader />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          {thumbnailMarkup}
        </View>
        {editing ? (
          <EditingCustomListActions
            customList={customList}
            onCustomListUpdate={onCustomListUpdate}
            onEditingDone={() => setEditing(false)}
          />
        ) : (
          <CustomListActions customList={customList} onEditing={setEditing} />
        )}
        <View
          style={{
            opacity: editing ? 0.4 : 1,
          }}>
          {!loading && ids.length && ids.length > manga.length ? (
            <HiddenMangaBanner />
          ) : null}
          {bodyMarkup}
        </View>
      </ScrollView>
    </>
  );
}
