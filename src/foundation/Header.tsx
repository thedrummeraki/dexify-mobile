import React, {useCallback, useContext, useState} from 'react';
import {Appbar, Searchbar} from 'react-native-paper';
import {HeaderContext} from '../prodivers';

interface Props {
  title?: string;
  subtitle?: string;
  goBack?: () => void;
  onSearch?: (query: string) => void;
}

export default function Header({title, subtitle, goBack}: Props) {
  const headerContext = useContext(HeaderContext);
  const [showSearchbar, setShowSearchbar] = useState(false);

  const handleSearch = headerContext.showSearch
    ? () => setShowSearchbar(true)
    : undefined;
  const handleGoBack = useCallback(() => {
    if (goBack) {
      goBack();
    }
  }, [goBack]);

  return null;

  return (
    <Appbar.Header>
      {goBack && !showSearchbar && <Appbar.BackAction onPress={handleGoBack} />}
      {showSearchbar && (
        <Searchbar
          value={headerContext.query}
          onChangeText={headerContext.onSearch}
          placeholder="Browse..."
          onIconPress={() => setShowSearchbar(false)}
        />
      )}
      {!showSearchbar && (
        <Appbar.Content
          title={headerContext.title || title}
          subtitle={headerContext.subtitle || subtitle}
        />
      )}
      {!showSearchbar && handleSearch && (
        <Appbar.Action icon="magnify" onPress={handleSearch} />
      )}
      {/* <Appbar.Action icon="dots-vertical" onPress={() => {}} /> */}
    </Appbar.Header>
  );
}
