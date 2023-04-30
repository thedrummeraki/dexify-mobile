import React from 'react';
import {Avatar, Chip, Text} from 'react-native-paper';
import {PagedResultsList, ScanlationGroup} from '../../api/mangadex/types';
import {useCategoryRequest, useGetRequest} from '../../api/utils';
import {UIScanlationGroupCategory} from '../../categories';
import CategoriesCollectionSection from './CategoriesCollectionSection';

export default function ScanlationGroupCategoryItem({
  category,
}: {
  category: UIScanlationGroupCategory;
}) {
  const {data, loading} =
    useCategoryRequest<PagedResultsList<ScanlationGroup>>(category);
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
              source={{uri: 'https://mangadex.org/img/avatar.png'}}
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
              source={{uri: 'https://mangadex.org/img/avatar.png'}}
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
