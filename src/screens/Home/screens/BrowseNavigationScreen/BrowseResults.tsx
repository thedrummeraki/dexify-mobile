import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleProp, View, ViewStyle} from 'react-native';
import {Title} from 'react-native-paper';
import {CoverSize, mangaImage, preferredMangaTitle} from 'src/api';
import {useLazyGetMangaList} from 'src/api/mangadex/hooks';
import {Author, Manga, PagedResultsList} from 'src/api/mangadex/types';
import {useLazyGetRequest} from 'src/api/utils';
import BasicList from 'src/components/BasicList';
import CategoriesCollectionItem from 'src/components/CategoriesCollection/CategoriesCollectionItem';
import {List} from 'src/components/List/List';
import {useDexifyNavigation} from 'src/foundation/Navigation';
import Thumbnail, {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {useScreenOrientation} from 'src/utils';
import {BrowseNavigationResource} from '.';
import BrowseMangaResults from './components/BrowseMangaResults';
import BrowseChapterResults from './components/BrowseChaptersResult';
import BrowseScanlationGroupResults from './components/BrowseScanlationGroupResults';
import BrowseAuthorsGroupResults from './components/BrowseAuthorsResults';

interface Props {
  query: string;
  resourceType: BrowseNavigationResource;
  style?: StyleProp<ViewStyle>;
}

export default function BrowseResults({query, resourceType}: Props) {
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 200;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  switch (resourceType) {
    case BrowseNavigationResource.Manga:
      return <BrowseMangaResults query={query} />;
    case BrowseNavigationResource.Author:
      return <BrowseAuthorsGroupResults query={query} />;
    case BrowseNavigationResource.Chapter:
      return <BrowseChapterResults query={query} />;
    case BrowseNavigationResource.Group:
      return <BrowseScanlationGroupResults query={query} />;
    default:
      return null;
  }
}
