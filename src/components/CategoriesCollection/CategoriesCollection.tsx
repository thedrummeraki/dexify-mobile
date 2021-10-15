import React, {useCallback} from 'react';
import {FlatList} from 'react-native';
import {UICategory, UICategoryType} from '../../categories';
import CategoriesCollectionItem from './CategoriesCollectionItem';

interface Props {
  categories: UICategory[];
}

export default function CategoriesCollection({categories}: Props) {
  return (
    <FlatList
      data={categories}
      renderItem={({item}) => <CategoriesCollectionItem category={item} />}
    />
  );
}
