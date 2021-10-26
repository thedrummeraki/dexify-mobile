import React, {useState} from 'react';
import {View} from 'react-native';
import {Badge, Checkbox, Text} from 'react-native-paper';
import {useDexifyNavigation} from 'src/foundation/Navigation';
import {chapterImage, preferredMangaTitle} from '../../api';
import {Chapter, Manga, PagedResultsList} from '../../api/mangadex/types';
import {useGetRequest} from '../../api/utils';
import {UIChapterCategory} from '../../categories';
import Thumbnail from '../../foundation/Thumbnail';
import CategoriesCollectionSection from './CategoriesCollectionSection';
import {url} from './utils';

export default function ChapterCategoryItem({
  category,
}: {
  category: UIChapterCategory;
}) {
  const navigation = useDexifyNavigation();
  const {data, loading} = useGetRequest<PagedResultsList<Chapter>>(
    url(category),
  );
  const sectionData = data?.result === 'ok' ? data.data : [];

  return (
    <CategoriesCollectionSection
      loading={category.loading || loading}
      title={category.title}
      data={sectionData}
      dimensions={{width: 120, height: 160}}
      renderItem={(item, dimensions) => {
        const {chapter, volume, title: chapterTitle} = item.attributes;
        const mangaRelationship = item.relationships.find(
          relationship => relationship.type === 'manga',
        );
        const manga = mangaRelationship?.attributes
          ? (mangaRelationship as any as Manga)
          : undefined;

        const title = manga ? preferredMangaTitle(manga) : chapterTitle;
        const onPress = manga
          ? () => navigation.navigate('ShowManga', {id: manga?.id})
          : undefined;

        return (
          <Thumbnail
            TopComponent={
              <Badge style={{borderRadius: 0, borderBottomRightRadius: 7}}>
                {(chapter && `Ch. ${chapter}`) ||
                  (volume && `Vol. ${volume}`) ||
                  'N/A'}
              </Badge>
            }
            imageUrl={chapterImage(item) || '/'}
            title={title}
            width={dimensions.size || dimensions.width!}
            height={dimensions.size || dimensions.height!}
            onPress={onPress}
          />
        );
      }}
    />
  );
}
