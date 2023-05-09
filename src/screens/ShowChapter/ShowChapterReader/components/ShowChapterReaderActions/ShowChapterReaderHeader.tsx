import React, {useState} from 'react';
import {View} from 'react-native';
import {
  Caption,
  IconButton,
  Menu,
  Subheading,
  useTheme,
} from 'react-native-paper';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {shareResource} from 'src/components/ShareButton/ShareButton';
import {useDexifyNavigation} from 'src/foundation';
import {useReaderContext} from '../ReaderProvider';

interface Props {
  visible: boolean;
}

export default function ShowChapterReaderHeader({visible}: Props) {
  const navigation = useDexifyNavigation();
  const [menuOpen, setMenuOpen] = useState(false);

  const {title, subtitle, manga, chapter} = useReaderContext();
  const {
    colors: {surface},
  } = useTheme();

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(visible ? 1 : 0, {duration: 500}),
    }),
    [visible],
  );

  const menuOptions: {title: string; icon?: string; onAction(): void}[] = [
    // {
    //   title: 'Reader options...',
    //   icon: 'cog',
    //   onAction: () => {},
    // },
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

  if (chapter) {
    menuOptions.push({
      title: 'Share chapter...',
      icon: 'share-variant',
      onAction: () => shareResource(chapter),
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
        animatedStyle,
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
            disabled={!visible}
            icon="arrow-left"
            size={20}
            style={{marginHorizontal: 10}}
            onPress={() => navigation.pop()}
          />
          <View style={{flex: 1, height: '100%'}}>
            <Subheading
              style={{marginTop: 5, paddingVertical: 0, marginVertical: 0}}
              numberOfLines={1}>
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
                disabled={!visible}
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
