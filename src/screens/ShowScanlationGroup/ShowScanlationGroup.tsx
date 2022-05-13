import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {EntityResponse, ScanlationGroup} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {useShowScanlationGroupRoute} from 'src/foundation';
import ShowScalationDetails from './ShowScanlationGroupDetails';

export default function ShowScalationGroup() {
  const {
    params: {id},
  } = useShowScanlationGroupRoute();
  const {data: artistData, loading} = useGetRequest<
    EntityResponse<ScanlationGroup>
  >(`https://api.mangadex.org/group/${id}`);

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (artistData?.result === 'ok') {
    return <ShowScalationDetails scanlationGroup={artistData.data} />;
  }

  return null;
}
