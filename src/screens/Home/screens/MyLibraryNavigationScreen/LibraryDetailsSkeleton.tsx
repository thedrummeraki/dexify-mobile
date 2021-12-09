import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {Title, IconButton, ActivityIndicator} from 'react-native-paper';
import BasicList from 'src/components/BasicList';
import {ThumbnailSkeleton} from 'src/foundation/Thumbnail';

export default function LibraryDetailsLoading() {
  const headerMarkup = (
    <View
      style={{
        marginHorizontal: 15,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Title>Your library</Title>
      <IconButton disabled icon="plus" />
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      {headerMarkup}
      <ActivityIndicator style={{flex: 1}} />
    </SafeAreaView>
  );
}
