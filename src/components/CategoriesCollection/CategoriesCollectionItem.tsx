import React from 'react';
import {UICategory} from '../../categories';
import ChapterCategoryItem from './ChapterCategoryItem';
import MangaCategoryItem from './MangaCategoryItem';

interface Props {
  category: UICategory;
}

export default function CategoriesCollectionItem({category}: Props) {
  if (category.type === 'manga') {
    return <MangaCategoryItem category={category} />;
  } else if (category.type === 'chapter') {
    return <ChapterCategoryItem category={category} />;
  }
  return null;
}
