import React, {useEffect, useState} from 'react';
import {useHeader, useSession, useSettings} from 'src/prodivers';
import {BottomNavigation} from 'react-native-paper';
import {
  BrowseNavigationScreen,
  LoginNavigationScreen,
  MyLibraryNavigationScreen,
  MyProfileNavigationScreen,
  FollowedMangaScreen,
} from './screens';
import {NewHome} from '..';
import {useBackgroundColor} from 'src/components/colors';

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
  const {spicyMode} = useSettings();
  console.log('SpikcYC', spicyMode);

  const background = spicyMode ? 'error' : undefined;
  const color = useBackgroundColor(background);

  const [routes, setRoutes] = useState([
    {key: 'main', title: 'Home', icon: 'home', color},
    {key: 'library', title: 'Library', icon: 'library-shelves', color},
    {key: 'browse', title: 'Browse...', icon: 'magnify', color},
    {key: 'followed', title: 'Followed', icon: 'heart', color},
    {key: 'profile', title: 'My profile', icon: 'account', color},
  ]);

  useEffect(() => {
    setRoutes(routes => routes.map(route => ({...route, color})));
  }, [color]);

  const renderScene = BottomNavigation.SceneMap({
    main: NewHome,
    browse: BrowseNavigationScreen,
    library: MyLibraryNavigationScreen,
    followed: FollowedMangaScreen,
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
    main: NewHome,
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
