import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {AllReadingStatusResponse} from 'src/api/mangadex/types';
import {useGetRequest, useLazyGetRequest} from 'src/api/utils';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {useSession} from 'src/prodivers';
import {useHomeCategories} from '../../../categories';
import {CategoriesCollection} from '../../../components';

export function MainNavigationScreen() {
  const categories = useHomeCategories();

  return <CategoriesCollection categories={categories} />;
}
