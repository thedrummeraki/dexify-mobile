import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {TextInput, Title} from 'react-native-paper';

interface Props<T> {
  title: string;
  values: T[];
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
  renderItem,
  search,
  Description,
}: Props<T>) {
  const [query, setQuery] = useState('');

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
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={values}
        contentContainerStyle={{paddingHorizontal: 15, paddingRight: 10}}
        renderItem={({item}) => renderItem(item)}
      />
    </View>
  );
}
