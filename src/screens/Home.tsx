import React from 'react';
import {Text, View} from 'react-native';
import {DexifyHeader} from '../components';
import {useHeader} from '../prodivers';

export default function Home() {
  const {query} = useHeader({title: 'Dexify ~ Browse', showSearch: true});

  return (
    <View>
      <Text>Query: {query}</Text>
    </View>
  );
}
