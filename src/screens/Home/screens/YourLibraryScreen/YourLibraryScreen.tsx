import React, {useState} from 'react';
import {View} from 'react-native';
import {Chip, Title} from 'react-native-paper';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {useSession} from 'src/prodivers';
import {AddedManga} from './components';
import ScreenChooser from './components/ScreenChooser';

export enum LibraryFilter {
  Added = 'Added',
  Lists = 'MD Lists',
  ChaptersFeed = 'Chapters feed',
  ReadingHistory = 'Reading history',
}

export default function YourLibraryScreen() {
  const {username} = useSession()!;

  const [currentFilter, setCurrentFilter] = useState(LibraryFilter.Added);
  const a = Object.values(LibraryFilter);

  return (
    <View style={{padding: 5}}>
      <Title style={{marginHorizontal: 15}}>{username}'s Library</Title>
      <View style={{paddingBottom: 5, marginTop: -5, marginHorizontal: 5}}>
        <CategoriesCollectionSection
          data={Object.values(LibraryFilter)}
          renderItem={item => {
            return (
              <Chip
                selected={item === currentFilter}
                onPress={() => setCurrentFilter(item)}>
                {item}
              </Chip>
            );
          }}
        />
      </View>
      {/* <View style={{paddingHorizontal: 10, marginBottom: 20}}> */}
      <ScreenChooser filter={currentFilter} />
      {/* </View> */}
    </View>
  );
}
