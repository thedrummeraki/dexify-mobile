import React from 'react';
import {TouchableNativeFeedback, Vibration, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme, Caption, ProgressBar, Text, Button} from 'react-native-paper';
import {useDexifyNavigation} from 'src/foundation';
import {ReadingState} from 'src/prodivers';
import {useDimensions} from 'src/utils';

interface Props {
  chapter: ReadingState.Chapter;
}

const actions = {
  start: {text: 'Start', icon: 'play', initialPage: undefined},
  continue: {text: 'Continue', icon: 'play', initialPage: undefined},
  're-read': {text: 'Read again', icon: 'replay', initialPage: 1},
};

export default function ContinueReadingItem({
  chapter: readingStateChapter,
}: Props) {
  const {
    title,
    coverUrl,
    currentPage,
    totalPageCount,
    id,
    mangaName,
    mangaId,
    volume,
    chapter,
    imageUrl,
  } = readingStateChapter;

  const navigation = useDexifyNavigation();
  const {width: deviceWidth} = useDimensions();
  const theme = useTheme();

  const progress = currentPage / totalPageCount;
  const action =
    progress < 0.1 ? 'start' : progress > 0.95 ? 're-read' : 'continue';

  const bordersOffset = 15;
  const width = deviceWidth - bordersOffset * 2 - 10;

  const chapterInfo = [
    chapter ? `Chapter ${chapter}` : null,
    volume ? `Volume ${volume}` : null,
  ]
    .filter(x => x)
    .join(' - ');

  const titleText = title || chapterInfo;

  return (
    <View style={{width, marginRight: 5}}>
      <TouchableNativeFeedback
        onPress={() =>
          navigation.push('ShowChapter', {
            id,
            jumpToPage: actions[action].initialPage || currentPage,
          })
        }
        onLongPress={() => {
          Vibration.vibrate(5);
          navigation.push('ShowManga', {id: mangaId});
        }}>
        <View style={{position: 'relative'}}>
          <FastImage
            source={{uri: coverUrl}}
            style={{width, aspectRatio: 2.5, opacity: 0.25}}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              paddingHorizontal: bordersOffset - 5,
              paddingVertical: 5,
              width,
            }}>
            <View style={{flexDirection: 'row', marginBottom: 3}}>
              <Text style={{color: theme.colors.placeholder}} numberOfLines={1}>
                {mangaName}
              </Text>
            </View>
            <Text numberOfLines={1}>{titleText}</Text>
            {title ? <Caption>{chapterInfo}</Caption> : null}
          </View>
          <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
            <View style={{flexDirection: 'row', marginBottom: 5}}>
              <Button icon={actions[action].icon}>
                {actions[action].text}
              </Button>
            </View>
          </View>
          <ProgressBar progress={progress} style={{height: 1}} />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}
