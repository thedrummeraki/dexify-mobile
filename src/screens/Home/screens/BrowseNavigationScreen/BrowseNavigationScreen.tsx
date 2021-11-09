import React, {useEffect, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {useDebouncedValue} from 'src/utils';
import BrowseDefaultState from './BrowseDefaultState';
import BrowseResults from './BrowseResults';

export function BrowseNavigationScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const query = useDebouncedValue(searchInput, 500);

  useEffect(() => {
    const unsubscribe = Keyboard.addListener('keyboardDidHide', () => {
      setSearchBarFocused(false);
    });

    return () => unsubscribe.remove();
  }, []);

  return (
    <View style={{flex: 1, flexDirection: 'column', padding: 5}}>
      <Searchbar
        value={searchInput}
        onChangeText={setSearchInput}
        autoCapitalize="none"
        placeholder="Browse manga, authors..."
        style={{marginTop: 5, marginHorizontal: 5}}
        onFocus={() => setSearchBarFocused(true)}
        onBlur={() => setSearchBarFocused(false)}
      />
      <View>
        {query ? (
          <BrowseResults query={query} />
        ) : (
          <BrowseDefaultState showSearchHistory={searchBarFocused} />
        )}
      </View>
    </View>
  );
}
