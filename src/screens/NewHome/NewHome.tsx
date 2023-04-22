import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Button, Text, Title} from 'react-native-paper';
import Feed from './Feed/Feed';
import {FeedResponse} from './Feed/types';
import {useFeed} from './hooks';

export default function HomeScreen() {
  return <Home />;
}

function Home() {
  const initialized = useRef(false);
  const {loading, data: responseData, error, refresh} = useFeed();
  const [data, setData] = useState<FeedResponse>();
  const [refreshing, setRefreshing] = useState(false);

  const handleOnRefresh = () => {
    setRefreshing(true);
    refresh()
      .then(() => console.log('[INFO] feed updated'))
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
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (error || data?.result === 'error') {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 30,
        }}>
        <Title>{'°(\u0060ฅωฅ`)°'}</Title>
        <Text style={{textAlign: 'center'}}>
          Something went wrong went fetching the feed data. Please try again.
        </Text>
        <Button mode="contained" onPress={refresh} style={{marginTop: 15}}>
          Let's go
        </Button>
      </View>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Feed
      data={data.data}
      refreshing={refreshing}
      onRefresh={handleOnRefresh}
      onFocus={refresh}
    />
  );
}
