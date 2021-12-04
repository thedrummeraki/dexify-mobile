import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useGetMangaList} from 'src/api/mangadex/hooks';
import {MangaRequestParams} from 'src/api/mangadex/types';
import {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import BasicList from '../BasicList';
import MangaThumbnail from '../MangaThumbnail';

interface Props {
  options?: MangaRequestParams;
}

export default function SearchCollection({options}: Props) {
  console.log(options);
  const {loading, data} = useGetMangaList(options);

  if (loading) {
    return (
      <BasicList
        loading
        itemStyle={{padding: 5}}
        skeletonLength={12}
        skeletonItem={<ThumbnailSkeleton height={160} width={120} />}
      />
    );
  }

  if (data?.result === 'ok') {
    return (
      <BasicList
        data={data.data}
        style={{marginHorizontal: 10}}
        itemStyle={{padding: 5}}
        renderItem={item => <MangaThumbnail manga={item} />}
      />
    );
  }

  return null;
}
