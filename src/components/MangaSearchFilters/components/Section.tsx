import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {TextInput, Title} from 'react-native-paper';
import {useRenderContext} from './RenderContext';

interface Props<T> {
  title: string;
  values: T[];
  style?: 'list' | 'wrap';
  renderItem: (value: T) => React.ReactElement | null;
  search?: {
    placeholder?: string;
    onQuery: (query: string) => void;
  };
  Description?: React.ReactNode;
}

export function Section<T>({
  title,
  values,
  style = 'list',
  renderItem,
  search,
  Description,
}: Props<T>) {
  const [query, setQuery] = useState('');
  const {mode} = useRenderContext();

  if (mode !== 'modal') {
    return null;
  }

  useEffect(() => {
    if (search) {
      search.onQuery(query);
    }
  }, [search, query]);

  return (
    <View style={{marginBottom: 30}}>
      <Title style={{marginHorizontal: 15, marginBottom: 10}}>{title}</Title>
      {search ? (
        <TextInput
          dense
          style={{marginHorizontal: 15, marginBottom: 10}}
          mode="outlined"
          placeholder="Search for tags..."
          value={query}
          onChangeText={setQuery}
        />
      ) : null}
      {Description ? (
        <View style={{marginHorizontal: 15, marginBottom: 10}}>
          {Description}
        </View>
      ) : null}
      {style === 'list' ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={values}
          contentContainerStyle={{paddingHorizontal: 15, paddingRight: 10}}
          renderItem={({item}) => renderItem(item)}
        />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginHorizontal: 15,
            marginVertical: 10,
          }}>
          {values.map(value => renderItem(value))}
        </View>
      )}
    </View>
  );
}
