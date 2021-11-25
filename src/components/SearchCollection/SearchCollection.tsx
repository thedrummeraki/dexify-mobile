import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useGetMangaList} from 'src/api/mangadex/hooks';
import {MangaRequestParams} from 'src/api/mangadex/types';
import BasicList from '../BasicList';
import MangaThumbnail from '../MangaThumbnail';

interface Props {
  options?: MangaRequestParams;
}

export default function SearchCollection({options}: Props) {
  const {loading, data} = useGetMangaList(options);

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (data?.result === 'ok') {
    return (
      <BasicList
        data={data.data}
        renderItem={item => <MangaThumbnail manga={item} />}
      />
    );
  }

  return null;
}
