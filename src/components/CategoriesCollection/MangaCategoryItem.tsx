import React from 'react';
import {Touchable, TouchableNativeFeedback, View} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import {mangaImage} from '../../api';
import {Manga, PagedResultsList} from '../../api/mangadex/types';
import {useGetRequest} from '../../api/utils';
import {UIMangaCategory} from '../../categories';
import Thumbnail from '../../foundation/Thumbnail';
import CategoriesCollectionSection from './CategoriesCollectionSection';
import {url} from './utils';

export default function MangaCategoryItem({
  category,
}: {
  category: UIMangaCategory;
}) {
  const {data, loading} = useGetRequest<PagedResultsList<Manga>>(url(category));
  const sectionData = data?.result === 'ok' ? data.data : [];

  if (category.requiresAuth) {
    return null;
  }

  return (
    <CategoriesCollectionSection
      loading={loading}
      title={category.title}
      data={sectionData}
      dimensions={{width: 120, height: 160}}
      renderItem={(item, dimensions) => (
        <Thumbnail
          key={item.id}
          imageUrl={mangaImage(item) || '/'}
          title={item.attributes.title.en}
          {...dimensions}
        />
      )}
    />
  );
}
