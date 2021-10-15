import React from 'react';
import {chapterImage} from '../../api';
import {Chapter, PagedResultsList} from '../../api/mangadex/types';
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
  const {data, loading} = useGetRequest<PagedResultsList<Chapter>>(
    url(category),
  );
  const sectionData = data?.result === 'ok' ? data.data : [];

  return (
    <CategoriesCollectionSection
      loading={loading}
      title={category.title}
      data={sectionData}
      dimensions={{width: 120, height: 160}}
      renderItem={(item, dimensions) => (
        <Thumbnail
          imageUrl={chapterImage(item) || '/'}
          title={item.attributes.title}
          {...dimensions}
        />
      )}
    />
  );
}
