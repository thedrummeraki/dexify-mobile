import React, {useState} from 'react';
import {View} from 'react-native';
import {
  Caption,
  IconButton,
  Menu,
  Subheading,
  useTheme,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import {useDexifyNavigation} from 'src/foundation';
import {useReaderContext} from '../ReaderProvider';

export default function ShowChapterReaderHeader() {
  const navigation = useDexifyNavigation();
  const [menuOpen, setMenuOpen] = useState(false);

  const {title, subtitle, manga} = useReaderContext();
  const {
    colors: {surface},
  } = useTheme();

  const menuOptions: {title: string; icon?: string; onAction(): void}[] = [
    {
      title: 'Reader options...',
      icon: 'cog',
      onAction: () => {},
    },
  ];

  if (manga) {
    menuOptions.push({
      title: 'View manga',
      icon: 'book',
      onAction: () => {
        setMenuOpen(false);
        navigation.navigate('ShowManga', manga);
      },
    });
  }

  return (
    <Animated.View
      style={[
        {
          zIndex: 1000,
          backgroundColor: surface,
          height: 60,
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
        },
      ]}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
        <View
          style={{
            flex: 1,
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconButton
            icon="arrow-left"
            size={20}
            style={{marginHorizontal: 10}}
            onPress={() => navigation.pop()}
          />
          <View style={{flex: 1, height: '100%'}}>
            <Subheading
              style={{marginTop: 5, paddingVertical: 0, marginVertical: 0}}>
              {title}
            </Subheading>
            {subtitle ? (
              <Caption style={{marginTop: -2.5}}>{subtitle}</Caption>
            ) : null}
          </View>
        </View>

        {menuOptions.length > 0 ? (
          <Menu
            visible={menuOpen}
            onDismiss={() => setMenuOpen(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                style={{marginHorizontal: 10}}
                onPress={() => setMenuOpen(true)}
              />
            }>
            {menuOptions.map(menuOption => (
              <Menu.Item
                key={menuOption.title}
                title={menuOption.title}
                icon={menuOption.icon}
                onPress={menuOption.onAction}
              />
            ))}
          </Menu>
        ) : null}
      </View>
    </Animated.View>
  );
}
