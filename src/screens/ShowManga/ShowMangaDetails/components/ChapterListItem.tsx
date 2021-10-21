import React from 'react';
import {View} from 'react-native';
import {List} from 'react-native-paper';
import {Chapter} from 'src/api/mangadex/types';
import {
  useDexifyNavigation,
  useShowChapterRoute,
} from 'src/foundation/Navigation';

interface Props {
  number: string;
  list: Chapter[];
}

export default function ChapterListItem({number, list}: Props) {
  const navigation = useDexifyNavigation();
  const title = `Chapter ${number}`;

  if (list.length === 1) {
    return (
      <List.Accordion
        expanded={false}
        title={title}
        onPress={() => navigation.navigate('ShowChapter', {id: list[0].id})}
        right={() => <List.Icon icon="play" />}>
        <View></View>
      </List.Accordion>
    );
  }
  return (
    <List.Accordion
      title={title}
      right={({isExpanded}) => (
        <List.Icon icon={isExpanded ? 'chevron-up' : 'chevron-down'} />
      )}>
      {list.map(chapter => (
        <List.Item
          key={chapter.id}
          title={chapter.attributes.translatedLanguage}
          onPress={() => navigation.navigate('ShowChapter', {id: chapter.id})}
        />
      ))}
    </List.Accordion>
  );
}
