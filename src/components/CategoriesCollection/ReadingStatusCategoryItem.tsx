import React, {useEffect, useState} from 'react';
import {useGetRequest} from 'src/api/utils';
import {UIReadingStatusCategory} from 'src/categories';
import MangaCategoryItem from './MangaCategoryItem';

interface Props {
  category: UIReadingStatusCategory;
}

export default function ReadingStatusCategoryItem({category}: Props) {
  const [currentlyReadingIds, setCurrentReadingIds] = useState<string[]>([]);
  const {data, loading, error} = useGetRequest<{
    statuses: {
      [key: string]:
        | 'reading'
        | 'on_hold'
        | 'plan_to_read'
        | 'dropped'
        | 're_reading'
        | 'completed';
    };
  }>(category.url);

  useEffect(() => {
    setCurrentReadingIds(
      Object.entries(data?.statuses || {})
        .filter(([_, status]) => status === 'reading')
        .map(([id, _]) => id),
    );
  }, [data]);

  if (error) {
    console.error('could not get reading status', error);
  }

  return (
    <MangaCategoryItem
      category={{
        loading,
        title: category.title,
        type: 'manga',
        ids: currentlyReadingIds,
        params: {
          'includes[]': 'cover_art',
        },
      }}
    />
  );
}
