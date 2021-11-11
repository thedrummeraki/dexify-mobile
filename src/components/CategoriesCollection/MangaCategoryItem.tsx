import React, {useEffect} from 'react';
import {Touchable, TouchableNativeFeedback, View} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import {useDexifyNavigation} from 'src/foundation/Navigation';
import {useSession} from 'src/prodivers';
import {mangaImage, preferredMangaTitle} from '../../api';
import {Manga, PagedResultsList} from '../../api/mangadex/types';
import {
  useCategoryRequest,
  useGetRequest,
  useLazyGetRequest,
} from '../../api/utils';
import {UIMangaCategory} from '../../categories';
import Thumbnail from '../../foundation/Thumbnail';
import MangaThumbnail from '../MangaThumbnail';
import CategoriesCollectionSection from './CategoriesCollectionSection';
import {url} from './utils';

export default function MangaCategoryItem({
  category,
}: {
  category: UIMangaCategory;
}) {
  const navigation = useDexifyNavigation();
  const {data, loading, error} =
    useCategoryRequest<PagedResultsList<Manga>>(category);
  const sectionData = data?.result === 'ok' ? data.data : [];
  const session = useSession();

  if (category.requiresAuth && !session) {
    return null;
  }

  return (
    <CategoriesCollectionSection
      loading={category.loading || loading}
      title={category.title}
      data={sectionData}
      dimensions={{width: 120, height: 160}}
      viewMore={category.viewMore}
      renderItem={(item, dimensions) => (
        <MangaThumbnail
          showReadingStatus
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
