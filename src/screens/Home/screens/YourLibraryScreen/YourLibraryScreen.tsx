import React from 'react';
import {View} from 'react-native';
import {Chip, Title} from 'react-native-paper';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {useSession} from 'src/prodivers';
import {AddedManga} from './components';

export default function YourLibraryScreen() {
  const {username} = useSession()!;

  return (
    <View style={{padding: 5}}>
      <Title style={{marginHorizontal: 15}}>{username}'s Library</Title>
      <View style={{paddingBottom: 5, marginTop: -5, marginHorizontal: 5}}>
        <CategoriesCollectionSection
          data={['Lists', 'Added', 'Followed', 'Reading history', 'Downloaded']}
          renderItem={item => {
            return (
              <Chip selected={false} onPress={() => {}}>
                {item}
              </Chip>
            );
          }}
        />
      </View>
      <AddedManga />
    </View>
  );
}
