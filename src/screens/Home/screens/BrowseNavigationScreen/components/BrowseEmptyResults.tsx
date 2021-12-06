import React from 'react';
import {Dimensions, View} from 'react-native';
import {Title, Paragraph, Text} from 'react-native-paper';
import {TextBadge} from 'src/components';
import {BrowseNavigationResource} from '..';

interface Props {
  resourceType: string;
  query: string;
  actionVerb?: string;
}

export default function BrowseEmptyResults({
  resourceType,
  query,
  actionVerb = 'were',
}: Props) {
  const height = Dimensions.get('screen').height / 2;

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height,
        width: '100%',
      }}>
      <Title>
        No {resourceType} {actionVerb} found.
      </Title>
      <Paragraph>
        You've searched for <Text style={{fontWeight: 'bold'}}>{query}</Text>{' '}
        but we coun't find any manga.
      </Paragraph>
    </View>
  );
}
