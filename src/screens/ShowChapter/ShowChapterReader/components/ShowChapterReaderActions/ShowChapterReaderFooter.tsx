import React, {useState} from 'react';
import {View} from 'react-native';
import {
  Button,
  Caption,
  IconButton,
  ProgressBar,
  Subheading,
  Text,
  useTheme,
} from 'react-native-paper';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {TextBadge} from 'src/components';
import {Page} from '../../types';
import {useReaderContext} from '../ReaderProvider';
import {ShowChapterReaderPageSwitcherModal} from './modals';

interface Props {
  visible: boolean;
  onPageSelect(page: number): void;
}

export default function ShowChapterReaderFooter({
  visible,
  onPageSelect,
}: Props) {
  const {currentPage, group, locale, pages} = useReaderContext();
  const totalPagesCount = pages.length;

  const [modalState, setModalState] = useState({
    pagePicker: false,
  });

  const {
    colors: {surface},
  } = useTheme();

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(visible ? 1 : 0, {duration: 500}),
    }),
    [visible],
  );

  return (
    <Animated.View
      style={[
        {
          backgroundColor: surface,
          height: 60,
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
        },
        animatedStyle,
      ]}>
      <View
        style={{
          flex: 1,
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{display: 'none'}}>
          <IconButton
            disabled={!visible}
            icon="skip-previous"
            onPress={() => {}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TextBadge
            disablePress={!visible}
            onPress={() =>
              setModalState(current => ({...current, pagePicker: true}))
            }
            content={`Page ${currentPage} / ${totalPagesCount}`}
          />
          {group !== undefined ? (
            <TextBadge
              disablePress={!visible}
              style={{marginLeft: 5}}
              content={group ? `Volume ${group}` : 'No volume'}
            />
          ) : null}
          {locale ? (
            <TextBadge
              disablePress={!visible}
              style={{marginLeft: 5}}
              content={locale.toLocaleUpperCase()}
            />
          ) : null}
        </View>
        <View style={{display: 'none'}}>
          <IconButton disabled={!visible} icon="skip-next" onPress={() => {}} />
        </View>
      </View>
      <ShowChapterReaderPageSwitcherModal
        visible={modalState.pagePicker}
        onPageChange={onPageSelect}
        onDismiss={() =>
          setModalState(current => ({...current, pagePicker: false}))
        }
      />
    </Animated.View>
  );
}
