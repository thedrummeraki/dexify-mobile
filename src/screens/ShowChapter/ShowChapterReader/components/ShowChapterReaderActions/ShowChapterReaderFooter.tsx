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
import Animated from 'react-native-reanimated';
import {TextBadge} from 'src/components';
import {Page} from '../../types';
import {useReaderContext} from '../ReaderProvider';
import {ShowChapterReaderPageSwitcherModal} from './modals';

export default function ShowChapterReaderFooter() {
  const {currentPage, group, locale, pages} = useReaderContext();
  const totalPagesCount = pages.length;

  const [modalState, setModalState] = useState({
    pagePicker: false,
  });

  const {
    colors: {surface},
  } = useTheme();

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
      ]}>
      <View
        style={{
          flex: 1,
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View>
          <IconButton icon="skip-previous" onPress={() => {}} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TextBadge
            onPress={() =>
              setModalState(current => ({...current, pagePicker: true}))
            }
            content={`Page ${currentPage} / ${totalPagesCount}`}
          />
          {group !== undefined ? (
            <TextBadge
              style={{marginLeft: 5}}
              onPress={() => {}}
              content={group ? `Volume ${group}` : 'No volume'}
            />
          ) : null}
          {locale ? (
            <TextBadge
              style={{marginLeft: 5}}
              onPress={() => {}}
              content={locale.toLocaleUpperCase()}
            />
          ) : null}
        </View>
        <View>
          <IconButton icon="skip-next" onPress={() => {}} />
        </View>
      </View>
      <ShowChapterReaderPageSwitcherModal
        visible={modalState.pagePicker}
        onDismiss={() =>
          setModalState(current => ({...current, pagePicker: false}))
        }
      />
    </Animated.View>
  );
}
