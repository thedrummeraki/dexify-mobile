import React from 'react';
import {View} from 'react-native';
import {CloseCurrentScreenHeader, MangaSearchCollection} from 'src/components';
import {useShowMangaListRoute} from 'src/foundation';

export default function ShowMangaList() {
  const {
    params: {title, description, params, ids},
  } = useShowMangaListRoute();

  return (
    <View>
      <CloseCurrentScreenHeader title={title} />
      <MangaSearchCollection
        options={{ids, ...params}}
        description={description}
      />
    </View>
  );
}
