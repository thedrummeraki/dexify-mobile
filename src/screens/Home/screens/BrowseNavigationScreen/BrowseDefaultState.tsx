import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {useBrowseCategories} from 'src/categories';
import {CategoriesCollection} from 'src/components';

interface Props {
  showSearchHistory?: boolean;
}

export default function BrowseDefaultState({showSearchHistory}: Props) {
  const categories = useBrowseCategories();

  if (showSearchHistory) {
    return (
      <View>
        <Text>Search history...</Text>
      </View>
    );
  }

  return (
    <View>
      <CategoriesCollection categories={categories} />
    </View>
  );
}
