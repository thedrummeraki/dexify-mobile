import React from 'react';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import MangaThumbnail from 'src/components/MangaThumbnail';
import {ThumbnailSkeleton} from 'src/foundation/Thumbnail';
import {Sections} from '../types';

interface Props {
  section: Sections.GeneralHome;
  hideIfEmpty?: boolean;
}

export default function GeneralHomeSection({
  section,
  hideIfEmpty = true,
}: Props) {
  const {title, manga, loading, viewMore: onAction} = section;
  const dimensions = {width: 120, height: 160};

  if ((!manga || manga.length === 0) && hideIfEmpty && !loading) {
    return null;
  }

  return (
    <CategoriesCollectionSection
      loading={loading}
      title={title}
      data={manga || []}
      dimensions={dimensions}
      viewMore={onAction ? {onAction} : undefined}
      renderItem={(item, dimensions) => (
        <MangaThumbnail
          showReadingStatus
          manga={item}
          aspectRatio={0.75}
          width={dimensions.size || dimensions.width!}
          height={dimensions.size || dimensions.height!}
        />
      )}
      skeletonLength={10}
      SkeletonItem={<ThumbnailSkeleton height={160} width={120} />}
    />
  );
}
