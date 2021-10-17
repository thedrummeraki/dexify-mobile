import React, {useState} from 'react';
import {View} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {useDebouncedValue} from 'src/utils';
import BrowseDefaultState from './BrowseDefaultState';
import BrowseResults from './BrowseResults';

export function BrowseNavigationScreen() {
  const [searchInput, setSearchInput] = useState('');
  const query = useDebouncedValue(searchInput, 500);

  return (
    <View style={{flex: 1, flexDirection: 'column', padding: 5}}>
      <Searchbar
        value={searchInput}
        onChangeText={setSearchInput}
        autoCapitalize="none"
        placeholder="Browse manga, authors..."
        style={{marginTop: 10, marginHorizontal: 5}}
      />
      <View>
        {query ? <BrowseResults query={query} /> : <BrowseDefaultState />}
      </View>
    </View>
  );
}
