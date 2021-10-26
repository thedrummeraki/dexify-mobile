import React from 'react';
import {UICategory} from '../../categories';
import AuthorCategoryItem from './AuthorCategoryItem';
import ChapterCategoryItem from './ChapterCategoryItem';
import MangaCategoryItem from './MangaCategoryItem';
import ReadingStatusCategoryItem from './ReadingStatusCategoryItem';
import ScanlationGroupCategoryItem from './ScanlationGroupCategoryItem';
import TagCategoryItem from './TagCategoryItem';

interface Props {
  category: UICategory;
}

export default function CategoriesCollectionItem({category}: Props) {
  if (category.ids && category.ids.length === 0 && !category.loading) {
    return null;
  }

  if (category.type === 'manga') {
    return <MangaCategoryItem category={category} />;
  } else if (category.type === 'chapter') {
    return <ChapterCategoryItem category={category} />;
  } else if (category.type === 'author') {
    return <AuthorCategoryItem category={category} />;
  } else if (category.type === 'tag') {
    return <TagCategoryItem category={category} />;
  } else if (category.type === 'group') {
    return <ScanlationGroupCategoryItem category={category} />;
  } else if (category.type === 'status') {
    return <ReadingStatusCategoryItem category={category} />;
  }
  return null;
}
