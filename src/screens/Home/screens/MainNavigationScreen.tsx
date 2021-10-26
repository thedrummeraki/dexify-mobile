import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useGetRequest, useLazyGetRequest} from 'src/api/utils';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {useSession} from 'src/prodivers';
import {useHomeCategories} from '../../../categories';
import {CategoriesCollection} from '../../../components';

export function MainNavigationScreen() {
  const session = useSession();
  const categories = useHomeCategories();
  const [loading, setLoading] = useState(true);

  const [currentlyReadingIds, setCurrentReadingIds] = useState<string[]>();
  const [getStatuses, statusesResponse] = useLazyGetRequest<{
    statuses: {
      [key: string]:
        | 'reading'
        | 'on_hold'
        | 'plan_to_read'
        | 'dropped'
        | 're_reading'
        | 'completed';
    };
  }>('https://api.mangadex.org/manga/status?status=reading');

  useEffect(() => {
    getStatuses();
  }, []);

  useEffect(() => {
    setCurrentReadingIds(
      Object.entries(statusesResponse.data?.statuses || {})
        .filter(([_, status]) => status === 'reading')
        .map(([id, _]) => id),
    );
  }, [statusesResponse.data]);

  // {
  //   loading,
  //   title: 'Currently reading',
  //   type: 'manga',
  //   ids: currentlyReadingIds,
  //   params: {
  //     'includes[]': 'cover_art',
  //   },
  // },

  return <CategoriesCollection categories={categories} />;
}

function CurrentReadingCategory() {
  const session = useSession();

  if (!session) {
    return null;
  }

  return (
    <CategoriesCollectionSection
      loading
      dimensions={{width: 120, height: 160}}
      title="Currently reading"
      data={[]}
      renderItem={() => null}
    />
  );
}
