import React, {useEffect, useRef, useState} from 'react';
import {CustomList, PagedResultsList} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useAuthenticatedLazyGetRequest} from 'src/api/utils';
import MDListsDetails from './MDListsDetails';
import MDListsDetailsLoading from './MDListsDetailsLoading';

export default function MDLists() {
  const initialized = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [getCustomLists, {loading, data}] = useAuthenticatedLazyGetRequest<
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
    return <MDListsDetailsLoading />;
  }

  return (
    <MDListsDetails
      customLists={data?.result === 'ok' ? data.data : []}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
