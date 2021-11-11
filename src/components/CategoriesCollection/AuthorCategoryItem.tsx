import React from 'react';
import {Avatar, Chip} from 'react-native-paper';
import {useDexifyNavigation} from 'src/foundation';
import {Author, PagedResultsList} from '../../api/mangadex/types';
import {useCategoryRequest} from '../../api/utils';
import {UIAuthorCategory} from '../../categories';
import CategoriesCollectionSection from './CategoriesCollectionSection';

export default function AuthorCategoryItem({
  category,
}: {
  category: UIAuthorCategory;
}) {
  const navigation = useDexifyNavigation();
  const {data, loading} =
    useCategoryRequest<PagedResultsList<Author>>(category);
  const sectionData = data?.result === 'ok' ? data.data : [];

  return (
    <CategoriesCollectionSection
      loading={category.loading || loading}
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
          onPress={() => navigation.push('ShowArtist', {id: item.id})}
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
