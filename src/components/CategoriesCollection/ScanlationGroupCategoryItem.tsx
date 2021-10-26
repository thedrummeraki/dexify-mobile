import React from 'react';
import {Avatar, Chip, Text} from 'react-native-paper';
import {PagedResultsList, ScanlationGroup} from '../../api/mangadex/types';
import {useGetRequest} from '../../api/utils';
import {UIScanlationGroupCategory} from '../../categories';
import CategoriesCollectionSection from './CategoriesCollectionSection';
import {url} from './utils';

export default function ScanlationGroupCategoryItem({
  category,
}: {
  category: UIScanlationGroupCategory;
}) {
  const {data, loading} = useGetRequest<PagedResultsList<ScanlationGroup>>(
    url(category),
  );
  const sectionData = data?.result === 'ok' ? data.data : [];

  return (
    <CategoriesCollectionSection
      loading={category.loading || loading}
      title={category.title}
      data={sectionData}
      dimensions={{size: 24}}
      skeletonLength={2}
      SkeletonItem={
        <Chip
          avatar={
            <Avatar.Image
              source={{uri: 'https://mangadex.org/avatar.png'}}
              size={24}
            />
          }>
          Loading...
        </Chip>
      }
      renderItem={item => (
        <Chip
          avatar={
            <Avatar.Image
              source={{uri: 'https://mangadex.org/avatar.png'}}
              size={24}
              key={item.id}
            />
          }>
          {item.attributes.name}
        </Chip>
      )}
    />
  );
}
