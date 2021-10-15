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
      contentContainerStyle={{marginTop: 10}}
      renderItem={({item}) => <CategoriesCollectionItem category={item} />}
    />
  );
}
