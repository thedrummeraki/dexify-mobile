import React from 'react';
import {Button} from 'react-native-paper';
import {Chapter} from 'src/api/mangadex/types';
import BasicList from 'src/components/BasicList';
import {useDexifyNavigation} from 'src/foundation';

interface Props {
  loading: boolean;
  count: number;
  chapters: Chapter[];
}

export default function ChaptersGridLayout({loading, count, chapters}: Props) {
  const navigation = useDexifyNavigation();
  const aspectRatio = count > 4 ? 1 / 4 : count === 1 ? 1 : 1 / 2;

  if (loading) {
    return (
      <BasicList
        aspectRatio={1 / 4}
        data={Array.from({length: 4}).map(id => ({id}))}
        renderItem={() => <Button mode="outlined">-</Button>}
      />
    );
  }

  return (
    <BasicList
      data={chapters}
      aspectRatio={aspectRatio}
      renderItem={item => (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ShowChapter', {id: item.id})}>
          {item.attributes.chapter === 'none' || !item.attributes.chapter
            ? 'N/A'
            : item.attributes.chapter}
        </Button>
      )}
    />
  );
}
