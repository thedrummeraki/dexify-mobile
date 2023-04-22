import React, {useCallback, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {findRelationships} from 'src/api';
import {
  BasicResultsResponse,
  CustomList,
  PagedResultsList,
} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {
  useAuthenticatedLazyGetRequest,
  useDeleteRequest,
  useLazyGetRequest,
  usePostRequest,
} from 'src/api/utils';
import {Banner, BasicModal, FullScreenModal} from 'src/components';
import {List} from 'src/components/List/List';
import {pluralize, wait} from 'src/utils';
import {useMangaDetails} from '../../../ShowMangaDetails';

interface Props {
  visible: boolean;
  onDismiss(): void;
}

export default function AddToMDListModal(props: Props) {
  return (
    <BasicModal
      {...props}
      title="Add to MDList"
      primaryAction={{content: 'Done', onAction: props.onDismiss}}>
      <CustomListsListModalChildren />
    </BasicModal>
  );
}

function CustomListsListModalChildren() {
  const [getCustomLists, {data, loading, error}] =
    useAuthenticatedLazyGetRequest<PagedResultsList<CustomList>>(
      UrlBuilder.currentUserCustomLists({limit: 100}),
    );

  const {manga} = useMangaDetails();
  const [selected, setSelected] = useState<string[]>([]);

  const [addMangaToCustomList] = usePostRequest<BasicResultsResponse>();
  const [removeMangaFromCustomList] = useDeleteRequest<BasicResultsResponse>();

  const handleAddMangaToList = useCallback(
    (listId: string) => {
      setSelected(current => [...current, listId]);
      return addMangaToCustomList(
        UrlBuilder.addMangaToCustomList(manga.id, listId),
      );
    },
    [manga.id],
  );

  const handleRemoveMangaFromList = useCallback(
    (listId: string) => {
      setSelected(current => current.filter(x => x !== listId));
      return removeMangaFromCustomList(
        UrlBuilder.removeMangaFromCustomList(manga.id, listId),
      );
    },
    [manga.id],
  );

  useEffect(() => {
    wait(1).then(() => getCustomLists());
  }, []);

  useEffect(() => {
    if (data?.result === 'ok') {
      setSelected(
        data.data
          .filter(customList =>
            findRelationships(customList, 'manga')
              .map(x => x.id)
              .includes(manga.id),
          )
          .map(x => x.id),
      );
    }
  }, [data]);

  if (loading) {
    return (
      <List
        loading
        skeletonLength={15}
        contentContainerStyle={{marginHorizontal: 10}}
      />
    );
  }

  if (error || data?.result === 'error') {
    return (
      <Banner
        body="We were not able to fetch your MDLists."
        primaryAction={{content: 'Try again', onAction: getCustomLists}}
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <FlatList
      keyExtractor={item => item.id}
      data={data.data}
      contentContainerStyle={{marginHorizontal: 10}}
      renderItem={({item: customList}) => {
        const title = customList.attributes.name;
        const subtitle = [
          pluralize(findRelationships(customList, 'manga').length, 'title'),
          customList.attributes.visibility,
        ].join(' - ');
        const image = {
          url: 'https://mangadex.org/avatar.png',
          width: 70,
        };
        const isSelected = selected.includes(customList.id);

        return (
          <List.Item
            selected={isSelected}
            title={title}
            subtitle={subtitle}
            image={image}
            onPress={() => {
              if (isSelected) {
                handleRemoveMangaFromList(customList.id);
              } else {
                handleAddMangaToList(customList.id);
              }
            }}
          />
        );
      }}
    />
  );
}
