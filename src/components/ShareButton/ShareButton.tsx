import React from 'react';
import {Share} from 'react-native';
import {IconButton} from 'react-native-paper';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';

type ResourceType = 'manga' | 'chapter' | 'custom_list';
type ShareableResourceType = 'title' | 'chapter' | 'list';

interface ShareableResource {
  id: string;
  type: ResourceType;
}

interface Props {
  resource: ShareableResource;
  title?: string;
}

export default function ShareButton({resource, title}: Props) {
  return (
    <IconButton
      icon="share-variant"
      onPress={() => shareResource(resource, title)}
    />
  );
}

export const shareResource = async (
  resource: ShareableResource,
  title?: string,
) => {
  try {
    const result = await Share.share(
      {
        title,
        url: getUrlFromResource(resource),
        message: getUrlFromResource(resource),
      },
      {dialogTitle: title},
    );
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    console.error(error);
  }
};

function getUrlFromResource(resource: ShareableResource) {
  let resourceType = toShareableResourceType(resource.type);

  return UrlBuilder.buildUrlWithHost(
    'https://mangadex.org',
    `/${resourceType}/${resource.id}`,
  );
}

function toShareableResourceType(
  resourceType: ResourceType,
): ShareableResourceType {
  switch (resourceType) {
    case 'manga':
      return 'title';
    case 'custom_list':
      return 'list';
  }

  return resourceType;
}
