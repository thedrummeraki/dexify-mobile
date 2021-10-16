import React, {useState} from 'react';
import {CategoriesCollection} from '../../components';
import {useHeader} from '../../prodivers';
import {useHomeCategories} from '../../categories';
import {BottomNavigation, Text} from 'react-native-paper';

const MainRoute = () => {
  const categories = useHomeCategories();
  return <CategoriesCollection categories={categories} />;
};

const BrowseRoute = () => <Text>Seaerching for...</Text>;
const LoginRoute = () => <Text>Log in</Text>;
const LogoutRoute = () => <Text>Logout</Text>;

export default function Home() {
  useHeader({title: 'Dexify ~ Browse', showSearch: false});

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'main', title: 'Home', icon: 'home'},
    {key: 'browse', title: 'Browse...', icon: 'magnify'},
    {key: 'login', title: 'Log in', icon: 'login'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    main: MainRoute,
    browse: BrowseRoute,
    login: LoginRoute,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
