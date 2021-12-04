import React, {ComponentProps, useEffect} from 'react';
import {Dimensions, View} from 'react-native';
import {ActivityIndicator, TextInput} from 'react-native-paper';
import {useGetMangaList, useLazyGetMangaList} from 'src/api/mangadex/hooks';
import {MangaRequestParams} from 'src/api/mangadex/types';
import {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {useDebouncedValue} from 'src/utils';
import BasicList from '../BasicList';
import MangaThumbnail from '../MangaThumbnail';

type Props = {
  options?: MangaRequestParams;
  timeout?: number;
} & Pick<
  ComponentProps<typeof BasicList>,
  'HeaderComponent' | 'HeaderComponentStyle'
>;

export default function MangaSearchCollection({
  options,
  timeout,
  HeaderComponent,
  HeaderComponentStyle,
}: Props) {
  const debouncedOptions = useDebouncedValue(options, timeout);
  const [get, {loading, data}] = useLazyGetMangaList();

  useEffect(() => {
    get(debouncedOptions);
  }, [debouncedOptions]);

  const manga = data?.result === 'ok' ? data.data : [];
  const skeletonWidth = Dimensions.get('screen').width / 3 - 5 * 3;

  return (
    <BasicList
      loading={loading}
      data={manga}
      style={{marginHorizontal: 10}}
      itemStyle={{padding: 5}}
      renderItem={item => <MangaThumbnail manga={item} />}
      skeletonLength={12}
      skeletonItem={<ThumbnailSkeleton height={160} width={skeletonWidth} />}
      HeaderComponent={HeaderComponent}
      HeaderComponentStyle={HeaderComponentStyle}
    />
  );
}
