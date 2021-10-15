import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
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
    return <Text>loading..</Text>;
  }

  if (data?.result === 'ok') {
    return (
      <View>
        <Text>
          {category.title}: {data.data.map(manga => manga.id).join(', ')}
        </Text>
      </View>
    );
  }

  return null;
}

function ChapterCategoryItem({category}: {category: UIChapterCategory}) {
  const {data, loading, error} = useGetRequest<PagedResultsList<Chapter>>(
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

  console.error(data?.errors || error);
  console.log(url(category));

  return null;
}
