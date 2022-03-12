import React, {useState} from 'react';
import {Image, TouchableNativeFeedback, View} from 'react-native';
import {Chip, Title} from 'react-native-paper';
import {FullScreenModal} from 'src/components';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {useDexifyNavigation} from 'src/foundation';
import {useSession} from 'src/prodivers';
import {MyProfileNavigationScreen} from '../MyProfileNavigationScreen';
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
  const navigation = useDexifyNavigation();

  return (
    <View style={{padding: 5}}>
      <View
        style={{
          flexDirection: 'row',
          padding: 5,
          paddingBottom: 0,
          marginHorizontal: 5,
          marginBottom: -5,
          alignItems: 'center',
        }}>
        <TouchableNativeFeedback
          useForeground
          onPress={() => navigation.push('ShowSettings')}
          background={TouchableNativeFeedback.Ripple('#fff', true)}>
          <Image
            source={{
              uri: `https://api.multiavatar.com/${username}.png`,
            }}
            style={{width: 30, aspectRatio: 1, borderRadius: 150}}
          />
        </TouchableNativeFeedback>
        <Title style={{marginHorizontal: 10}}>{username}'s Library</Title>
      </View>
      <View style={{paddingBottom: 5, marginHorizontal: 5}}>
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
      <ScreenChooser filter={currentFilter} />
    </View>
  );
}
