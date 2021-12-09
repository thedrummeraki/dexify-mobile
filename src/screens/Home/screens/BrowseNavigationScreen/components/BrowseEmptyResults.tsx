import React from 'react';
import {Dimensions, View} from 'react-native';
import {Title, Paragraph, Text} from 'react-native-paper';
import {TextBadge} from 'src/components';
import {pluralize} from 'src/utils';
import {BrowseNavigationResource} from '..';

interface Props {
  resourceType: string;
  resourceTypePlural?: string;
  query: string;
  actionVerb?: string;
}

export default function BrowseEmptyResults({
  resourceType,
  resourceTypePlural,
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
        {pluralize(0, resourceType, {
          plural: resourceTypePlural,
          zeroPrefix: 'No',
        })}{' '}
        {actionVerb} found.
      </Title>
      <Paragraph>
        You've searched for <Text style={{fontWeight: 'bold'}}>{query}</Text>{' '}
        but we coun't find any {resourceType}.
      </Paragraph>
    </View>
  );
}
