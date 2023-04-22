import React, {useEffect, useRef, useState} from 'react';
import {useDexifyNavigation} from 'src/foundation/Navigation';
import {useSession} from 'src/prodivers';
import {Manga, PagedResultsList} from '../../api/mangadex/types';
import {useCategoryRequest} from '../../api/utils';
import {UIMangaCategory} from '../../categories';
import MangaThumbnail from '../MangaThumbnail';
import CategoriesCollectionSection from './CategoriesCollectionSection';

export default function MangaCategoryItem({
  category,
  showReadingStatus = true,
}: {
  category: UIMangaCategory;
  showReadingStatus?: boolean;
}) {
  const initialized = useRef(false);
  const navigation = useDexifyNavigation();
  const {data, loading, error} =
    useCategoryRequest<PagedResultsList<Manga>>(category);

  const [manga, setManga] = useState<Manga[]>([]);

  useEffect(() => {
    if (data?.result === 'ok') {
      setManga(data.data);
      initialized.current = true;
    }
  }, [data]);

  return (
    <CategoriesCollectionSection
      loading={(!initialized.current && (category.loading || loading)) || false}
      title={category.title}
      data={manga}
      skeletonLength={category.ids?.length}
      dimensions={{width: 120, height: 160}}
      viewMore={category.viewMore}
      renderItem={(item, dimensions) => (
        <MangaThumbnail
          showReadingStatus={showReadingStatus}
          manga={item}
          aspectRatio={0.75}
          hideTitle={category.hideTitle}
          width={dimensions.size || dimensions.width!}
          height={dimensions.size || dimensions.height!}
        />
      )}
    />
  );
}
