import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Caption, Title} from 'react-native-paper';
import {Manga} from 'src/api/mangadex/types';
import {useDexifyNavigation} from 'src/foundation';
import {useHeader} from 'src/prodivers';
import BasicList from './BasicList';
import MangaThumbnail from './MangaThumbnail';

interface BasicProps {
  manga: Manga[];
  title?: string;
  description?: string;
}

type MangaThumbnailProps = Omit<
  React.ComponentProps<typeof MangaThumbnail>,
  'manga' | 'onPress'
>;

type Props = BasicProps & MangaThumbnailProps;

export default function MangaCollection({
  manga,
  title,
  description,
  ...thumbnailProps
}: Props) {
  useHeader({title: ' '});
  const navigation = useDexifyNavigation();

  return (
    <ScrollView>
      {title || description ? (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 10,
            paddingBottom: 15,
          }}>
          {title ? (
            <Title style={{textAlign: 'center'}}>{title}</Title>
          ) : undefined}
          {description ? (
            <Caption style={{fontSize: 16, textAlign: 'center'}}>
              {description}
            </Caption>
          ) : undefined}
        </View>
      ) : undefined}
      <BasicList
        data={manga}
        renderItem={item => (
          <MangaThumbnail
            manga={item}
            onPress={() => navigation.push('ShowManga', {id: item.id})}
            {...thumbnailProps}
          />
        )}
      />
    </ScrollView>
  );
}
