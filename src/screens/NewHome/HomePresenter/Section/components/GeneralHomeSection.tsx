import React from 'react';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import MangaThumbnail from 'src/components/MangaThumbnail';
import {Sections} from '../types';

interface Props {
  section: Sections.GeneralHome;
  hideIfEmpty?: boolean;
}

export default function GeneralHomeSection({
  section,
  hideIfEmpty = true,
}: Props) {
  const {title, manga} = section;

  if (manga.length === 0 && hideIfEmpty) {
    return null;
  }

  return (
    // <CategoriesCollectionSection
    //   data={manga}
    //   title={title}
    //   viewMore={onAction ? {onAction} : undefined}
    //   renderItem={manga => <MangaThumbnail manga={manga} />}
    // />

    <CategoriesCollectionSection
      title={title}
      data={manga}
      dimensions={{width: 120, height: 160}}
      // viewMore={category.viewMore}
      renderItem={(item, dimensions) => (
        <MangaThumbnail
          showReadingStatus
          manga={item}
          aspectRatio={0.75}
          width={dimensions.size || dimensions.width!}
          height={dimensions.size || dimensions.height!}
        />
      )}
    />
  );
}
