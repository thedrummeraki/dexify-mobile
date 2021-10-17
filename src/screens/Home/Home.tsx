import React, {useState} from 'react';
import {useHeader} from '../../prodivers';
import {BottomNavigation} from 'react-native-paper';
import {
  BrowseNavigationScreen,
  LoginNavigationScreen,
  MainNavigationScreen,
} from './screens';

export default function Home() {
  useHeader({title: 'Dexify', showSearch: false});

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'main', title: 'Home', icon: 'home'},
    {key: 'browse', title: 'Browse...', icon: 'magnify'},
    {key: 'login', title: 'Log in', icon: 'login'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    main: MainNavigationScreen,
    browse: BrowseNavigationScreen,
    login: LoginNavigationScreen,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
