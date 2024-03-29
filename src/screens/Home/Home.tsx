import React, {useEffect, useState} from 'react';
import {useHeader, useSession, useSettings} from 'src/prodivers';
import {BottomNavigation} from 'react-native-paper';
import {
  BrowseNavigationScreen,
  LoginNavigationScreen,
  MyLibraryNavigationScreen,
  MyProfileNavigationScreen,
  FollowedMangaScreen,
  YourLibraryScreen,
} from './screens';
import {NewHome} from '..';
import {useBackgroundColor} from 'src/components/colors';
import {useDexifyNavigation} from 'src/foundation';
import {Linking} from 'react-native';
import ShowSettings from '../ShowSettings';

const MANGA_URL_REGEX =
  /https:\/\/mangadex.org\/(title|manga)\/([a-zA-Z-]+)(\/\s.)?/;

export default function Home() {
  const navigation = useDexifyNavigation();

  useEffect(() => {
    const event = Linking.addEventListener('url', ({url}) => {
      const match = url.match(MANGA_URL_REGEX);
      if (match && match.length > 1) {
        console.log('found a match!', match);
        navigation.push('ShowManga', {id: match[1]});
      } else {
        console.log("Didn't know how to open mangadex URL", url);
      }
    });

    return () => event.remove();
  }, []);

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

  const background = spicyMode ? 'error' : undefined;
  const color = useBackgroundColor(background);

  const [routes, setRoutes] = useState([
    {key: 'main', title: 'Home', icon: 'home', color},
    // {key: 'library', title: 'Library', icon: 'library-shelves', color},
    {key: 'profile', title: 'Your library', icon: 'library-shelves', color},
    {key: 'browse', title: 'Browse...', icon: 'magnify', color},
    // {key: 'followed', title: 'Followed', icon: 'heart', color},
    {key: 'settings', title: 'Settings', icon: 'cog', color},
  ]);

  useEffect(() => {
    setRoutes(routes => routes.map(route => ({...route, color})));
  }, [color]);

  const renderScene = BottomNavigation.SceneMap({
    main: NewHome,
    browse: BrowseNavigationScreen,
    // library: MyLibraryNavigationScreen,
    // followed: FollowedMangaScreen,
    profile: YourLibraryScreen,
    settings: ShowSettings,
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
    {key: 'settings', title: 'Settings', icon: 'cog'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    main: NewHome,
    browse: BrowseNavigationScreen,
    login: LoginNavigationScreen,
    settings: ShowSettings,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
