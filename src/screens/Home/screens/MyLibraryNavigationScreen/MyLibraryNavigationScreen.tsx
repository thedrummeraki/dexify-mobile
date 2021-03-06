import React, {useEffect, useRef, useState} from 'react';
import {CustomList, PagedResultsList} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import LibraryDetails from './LibraryDetails';
import LibraryDetailsLoading from './LibraryDetailsSkeleton';

export default function MyLibraryNavigationScreen() {
  const initialized = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [getCustomLists, {loading, data}] = useLazyGetRequest<
    PagedResultsList<CustomList>
  >(UrlBuilder.currentUserCustomLists({limit: 100}));

  const onRefresh = () => {
    setRefreshing(true);
    getCustomLists()
      .then(console.log)
      .then(() => console.log('[INFO] custom list list updated'))
      .catch(console.error)
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    getCustomLists();
  }, []);

  useEffect(() => {
    if (!initialized.current && !loading) {
      initialized.current = true;
    }
  }, [loading]);

  if (loading && !initialized.current) {
    return <LibraryDetailsLoading />;
  }

  return (
    <LibraryDetails
      customLists={data?.result === 'ok' ? data.data : []}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
