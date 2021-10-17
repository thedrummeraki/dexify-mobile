import React from 'react';
import {View} from 'react-native';
import {Avatar, Chip, Text} from 'react-native-paper';
import {chapterImage} from '../../api';
import {Author, PagedResultsList} from '../../api/mangadex/types';
import {useGetRequest} from '../../api/utils';
import {UIAuthorCategory} from '../../categories';
import Thumbnail from '../../foundation/Thumbnail';
import CategoriesCollectionSection from './CategoriesCollectionSection';
import {url} from './utils';

export default function AuthorCategoryItem({
  category,
}: {
  category: UIAuthorCategory;
}) {
  const {data, loading} = useGetRequest<PagedResultsList<Author>>(
    url(category),
  );
  const sectionData = data?.result === 'ok' ? data.data : [];

  return (
    <CategoriesCollectionSection
      loading={loading}
      title={category.title}
      data={sectionData}
      dimensions={{size: 24}}
      skeletonLength={1}
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
