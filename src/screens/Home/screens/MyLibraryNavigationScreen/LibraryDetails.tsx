import React from 'react';
import {RefreshControl, SafeAreaView, View, ScrollView} from 'react-native';
import {Button, Title} from 'react-native-paper';
import {mangaImage} from 'src/api';
import {ContentRating, Manga} from 'src/api/mangadex/types';
import BasicList from 'src/components/BasicList';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail from 'src/foundation/Thumbnail';
import {useLibraryContext} from 'src/prodivers';

interface MangaInList {
  title: string;
  id: string;
  mangaCount: number;
  manga: Manga[];
  mangaId?: string;
}

interface Props {
  mangaInList: MangaInList[];
}

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function LibraryDetails({mangaInList}: Props) {
  const navigation = useDexifyNavigation();
  const {createCustomList, refreshCustomLists} = useLibraryContext();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshCustomLists!().then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        style={{flex: 1, margin: 10}}
        refreshControl={
          <RefreshControl
            enabled
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <View style={{padding: 10}}>
          <Title>Your library</Title>
          <Button mode="contained" onPress={() => {}}>
            Create new list
          </Button>
        </View>
        <BasicList
          data={mangaInList}
          aspectRatio={1 / 2}
          renderItem={item => {
            const imageUrl =
              item.manga.length < 1
                ? 'https://mangadex.org/avatar.png'
                : item.manga.map(manga => mangaImage(manga));
            return (
              <Thumbnail
                imageUrl={imageUrl}
                width="100%"
                aspectRatio={1}
                title={item.title}
                onPress={() =>
                  navigation.push('ShowMangaList', {
                    params: {
                      ids: item.manga.map(m => m.id),
                      contentRating: Object.values(ContentRating),
                    },
                  })
                }
              />
            );
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
