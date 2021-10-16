import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Searchbar, TextInput} from 'react-native-paper';
import {Container} from '../../../../components';
import {useDebouncedValue} from '../../../../utils';
import BrowseDefaultState from './BrowseDefaultState';
import BrowseResults from './BrowseResults';

export function BrowseNavigationScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const query = useDebouncedValue(searchInput, 500);

  return (
    <ScrollView>
      <View>
        <View style={{flex: 1, flexDirection: 'row', padding: 5}}>
          <Searchbar
            value={searchInput}
            onChangeText={setSearchInput}
            autoCapitalize="none"
            placeholder="Browse manga, authors..."
            style={{flexGrow: 1}}
          />
        </View>
        <View>
          {query ? (
            <BrowseResults query={query} onLoading={setLoading} />
          ) : (
            <BrowseDefaultState />
          )}
        </View>
      </View>
    </ScrollView>
  );
}
