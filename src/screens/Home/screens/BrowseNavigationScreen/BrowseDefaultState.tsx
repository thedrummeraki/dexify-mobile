import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {useBrowseCategories} from 'src/categories';
import {CategoriesCollection} from 'src/components';

export default function BrowseDefaultState() {
  const categories = useBrowseCategories();

  return (
    <View>
      <CategoriesCollection categories={categories} />
    </View>
  );
}
