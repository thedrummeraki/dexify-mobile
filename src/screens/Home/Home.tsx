import React, {useState} from 'react';
import {useHeader, useSession} from 'src/prodivers';
import {BottomNavigation} from 'react-native-paper';
import {
  BrowseNavigationScreen,
  LoginNavigationScreen,
  MyLibraryNavigationScreen,
  MyProfileNavigationScreen,
  FollowedMangaScreen,
} from './screens';
import {NewHome} from '..';

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
    {key: 'library', title: 'Library', icon: 'library-shelves'},
    {key: 'browse', title: 'Browse...', icon: 'magnify'},
    {key: 'followed', title: 'Followed', icon: 'heart'},
    {key: 'profile', title: 'My profile', icon: 'account'},
  ]);

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
