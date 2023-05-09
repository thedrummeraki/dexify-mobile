import React from 'react';
import {FlatList, TouchableNativeFeedback, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, Caption, ProgressBar, Text, useTheme} from 'react-native-paper';
import {useDexifyNavigation} from 'src/foundation';
import {useDimensions} from 'src/utils';
import {Sections} from '../types';
import ContinueReadingItem from './ContinueReadingSection/ContinueReadingItem';

interface Props {
  section: Sections.ContinueReading;
}

export default function ContinueReadingSection({section}: Props) {
  const {chapters} = section;
  const {width} = useDimensions();

  return (
    <View style={{margin: 15}}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={chapters}
        keyExtractor={item => item.id}
        renderItem={({item: chapter}) => (
          <ContinueReadingItem chapter={chapter} />
        )}
      />
    </View>
  );
}
