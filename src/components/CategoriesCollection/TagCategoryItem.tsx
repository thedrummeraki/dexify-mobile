import React from 'react';
import {View} from 'react-native';
import {Avatar, Chip, Text} from 'react-native-paper';
import {chapterImage} from '../../api';
import {Author, Manga, PagedResultsList} from '../../api/mangadex/types';
import {useGetRequest} from '../../api/utils';
import {UITagCategory} from '../../categories';
import Thumbnail from '../../foundation/Thumbnail';
import CategoriesCollectionSection from './CategoriesCollectionSection';
import {url} from './utils';

export default function TagCategoryItem({category}: {category: UITagCategory}) {
  const {data, loading} = useGetRequest<PagedResultsList<Manga.Tag>>(
    url(category),
  );
  const sectionData = data?.result === 'ok' ? data.data : [];

  return (
    <CategoriesCollectionSection
      loading={category.loading || loading}
      title={category.title}
      data={sectionData}
      dimensions={{size: 24}}
      skeletonLength={1}
      SkeletonItem={<Chip icon="tag">Loading...</Chip>}
      renderItem={item => <Chip icon="tag">{item.attributes.name.en}</Chip>}
    />
  );
}
