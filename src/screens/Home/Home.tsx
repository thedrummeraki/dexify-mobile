import React, {useState} from 'react';
import {useHeader, useSession} from 'src/prodivers';
import {BottomNavigation} from 'react-native-paper';
import {
  BrowseNavigationScreen,
  LoginNavigationScreen,
  MainNavigationScreen,
  MyProfileNavigationScreen,
} from './screens';

export default function Home() {
  useHeader({title: 'Dexify', hideHeader: true});

  const session = useSession();
  if (session) {
    return <AuthenticatedBottomNavigation />;
  } else {
    return <UnauthenticatedBottomNavigation />;
  }
}

function AuthenticatedBottomNavigation() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'main', title: 'Home', icon: 'home'},
    {key: 'browse', title: 'Browse...', icon: 'magnify'},
    {key: 'profile', title: 'My profile', icon: 'account'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    main: MainNavigationScreen,
    browse: BrowseNavigationScreen,
    profile: MyProfileNavigationScreen,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}

function UnauthenticatedBottomNavigation() {
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
