import React from 'react';
import {CategoriesCollection} from '../components';
import {useHeader} from '../prodivers';
import {useHomeCategories} from '../categories';

export default function Home() {
  const {} = useHeader({title: 'Dexify ~ Browse', showSearch: true});
  const categories = useHomeCategories();

  return <CategoriesCollection categories={categories} />;
}
