import React, {useState} from 'react';
import {View} from 'react-native';
import {Chip, Searchbar} from 'react-native-paper';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {useDebouncedValue} from 'src/utils';
import BrowseDefaultState from './BrowseDefaultState';
import BrowseResults from './BrowseResults';

export enum BrowseNavigationResource {
  Manga = 'Manga',
  Author = 'Authors',
  Chapter = 'Chapters',
  Group = 'Scanlation groups',
  User = 'Users',
}

export function BrowseNavigationScreen() {
  const [resourceType, setResourceType] = useState<BrowseNavigationResource>(
    BrowseNavigationResource.Manga,
  );
  const [searchInput, setSearchInput] = useState('');
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const query = useDebouncedValue(searchInput, 500);

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
      <View style={{marginTop: 5, paddingBottom: 115}}>
        {query ? (
          <>
            <CategoriesCollectionSection
              data={Object.values(BrowseNavigationResource)}
              renderItem={item => {
                return (
                  <Chip
                    selected={resourceType === item}
                    onPress={() => setResourceType(item)}>
                    {item}
                  </Chip>
                );
              }}
            />
            <BrowseResults query={query} resourceType={resourceType} />
          </>
        ) : (
          <BrowseDefaultState showSearchHistory={searchBarFocused} />
        )}
      </View>
    </View>
  );
}
