import React, {useContext, useEffect, useRef, useState} from 'react';
import {Text} from 'react-native-paper';
import {preferredMangaTitle} from 'src/api';
import Feed from './Feed/Feed';
import {FeedResponse} from './Feed/types';
import HomePresenter from './HomePresenter';
import HomeProvider, {HomeContext} from './HomeProvider';
import {useFeed, useHomePresenter} from './hooks';

export default function HomeScreen() {
  return (
    <HomeProvider>
      <Home />
    </HomeProvider>
  );
}

function Home() {
  const initialized = useRef(false);
  const {loading, data: responseData, error, refresh} = useFeed();
  const [data, setData] = useState<FeedResponse>();
  const [refreshing, setRefreshing] = useState(false);

  const handleOnRefresh = () => {
    setRefreshing(true);
    refresh()
      .then(() => console.log('feed updated'))
      .catch(console.error)
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    if (responseData) {
      setData(responseData);
    }

    if (initialized.current) {
      return;
    }

    initialized.current = Boolean(responseData);
  }, [responseData]);

  if (loading && !initialized.current) {
    return <Text>Loading...</Text>;
  }

  if (error || data?.result === 'error') {
    console.error(error || data?.result === 'error' ? data : 'wth is going on');
    return <Text>Uh-oh, this didn't work. Please try again.</Text>;
  }

  if (!data) {
    return null;
  }

  return (
    <Feed
      data={data.data}
      refreshing={refreshing}
      onRefresh={handleOnRefresh}
    />
  );
}
