import React from 'react';
import {useHomeCategories} from '../../../categories';
import {CategoriesCollection} from '../../../components';

export function MainNavigationScreen() {
  const categories = useHomeCategories();

  return <CategoriesCollection categories={categories} />;
}
