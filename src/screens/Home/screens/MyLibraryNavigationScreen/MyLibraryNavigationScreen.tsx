import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {useLibraryContext} from 'src/prodivers';
import LibraryDetails from './LibraryDetails';

export default function MyLibraryNavigationScreen() {
  const {loading, customListInfo} = useLibraryContext();

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (customListInfo) {
    const mangaInList = customListInfo.map(info => {
      const {customList, manga} = info;
      return {
        id: customList.id,
        title: customList.attributes.name,
        mangaCount: manga.length,
        manga,
      };
    });

    return <LibraryDetails mangaInList={mangaInList} />;
  }

  return null;
}
