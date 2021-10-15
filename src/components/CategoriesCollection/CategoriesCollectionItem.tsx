import React from 'react';
import {FlatList, View} from 'react-native';
import {Card, Paragraph, Text, Title} from 'react-native-paper';
import {Chapter, Manga, PagedResultsList} from '../../api/mangadex/types';
import {useGetRequest} from '../../api/utils';
import {UICategory, UIChapterCategory, UIMangaCategory} from '../../categories';
import {url} from './utils';

interface Props {
  category: UICategory;
}

export default function CategoriesCollectionItem({category}: Props) {
  if (category.type === 'manga') {
    return <MangaCategoryItem category={category} />;
  } else {
    return <ChapterCategoryItem category={category} />;
  }
}

function MangaCategoryItem({category}: {category: UIMangaCategory}) {
  const {data, loading} = useGetRequest<PagedResultsList<Manga>>(url(category));

  if (loading) {
    return (
      <Card>
        <Card.Content>
          <Title>{category.title}</Title>
          <Paragraph>{category.description}</Paragraph>
          <Paragraph>Loading...</Paragraph>
        </Card.Content>
      </Card>
    );
  }

  if (data?.result === 'ok') {
    return (
      <Card>
        <Card.Content>
          <Title>{category.title}</Title>
          {category.description && (
            <Paragraph>{category.description}</Paragraph>
          )}
          <FlatList
            horizontal
            data={data.data}
            renderItem={({item}) => (
              <View
                key={item.id}
                style={{height: 200, width: 150, backgroundColor: '#000'}}>
                <Text style={{color: '#fff'}}>text</Text>
              </View>
            )}
          />
        </Card.Content>
      </Card>
    );
  }

  return null;
}

function ChapterCategoryItem({category}: {category: UIChapterCategory}) {
  const {data, loading} = useGetRequest<PagedResultsList<Chapter>>(
    url(category),
  );

  if (loading) {
    return <Text>loading..</Text>;
  }

  if (data?.result === 'ok') {
    return (
      <View>
        <Text>
          {category.title}:{' '}
          {data.data.map(chapter => chapter.attributes.chapter).join(', ')}
        </Text>
      </View>
    );
  }

  return null;
}
