import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import {CustomList, EntityResponse} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import {useShowCustomListRoute} from 'src/foundation';
import ShowCustomListDetails from './ShowCustomListDetails';

export default function ShowCustomList() {
  const initialized = useRef(false);
  const [customList, setCustomList] = useState<CustomList>();
  const [refreshing, setRefreshing] = useState(false);

  const route = useShowCustomListRoute();
  const {id} = route.params;

  const [get, {data, loading, error}] = useLazyGetRequest<
    EntityResponse<CustomList>
  >(UrlBuilder.customList(id));

  const handleRefresh = () => {
    setRefreshing(true);
    get()
      .then(console.log)
      .then(() => console.log('[INFO] custom list updated'))
      .catch(console.error)
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    get();
  }, []);

  useEffect(() => {
    if (data?.result === 'ok') {
      setCustomList(data.data);
      initialized.current = true;
    }
  }, [data]);

  useEffect(() => {
    if (refreshing) {
      get();
    }
  }, [refreshing]);

  if (loading && !initialized.current) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (error || data?.result === 'error') {
    if (data?.result === 'error') {
      console.error(data.errors);
    } else {
      console.error(error);
    }
    return null;
  }

  if (customList)
    return (
      <ShowCustomListDetails
        customList={customList}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onCustomListUpdate={customList => {
          setCustomList(customList);
          handleRefresh();
        }}
      />
    );

  return null;
}
