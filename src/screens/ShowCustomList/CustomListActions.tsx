import React, {useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import {Title, Button} from 'react-native-paper';
import {findRelationship} from 'src/api';
import {CustomList, EntityResponse, User} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import {TextBadge} from 'src/components';
import {BackgroundColor} from 'src/components/colors';
import {useSession} from 'src/prodivers';

interface Props {
  customList: CustomList;
  onEditing(editing: boolean): void;
}

export default function CustomListActions({customList, onEditing}: Props) {
  return (
    <View style={{marginHorizontal: 15, marginBottom: 20}}>
      <Title style={{marginTop: 15}}>{customList.attributes.name}</Title>
      <View style={{flexDirection: 'row', marginTop: 5}}>
        <CustomListVisiblityBadge customList={customList} />
      </View>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <Button compact icon="pencil-outline" onPress={() => onEditing(true)}>
          Edit
        </Button>
        <Button disabled icon="plus" style={{marginLeft: 10}}>
          Add manga
        </Button>
      </View>
    </View>
  );
}

function UserInfo({customList}: Pick<Props, 'customList'>) {
  const id = findRelationship(customList, 'user')?.id;
  const session = useSession();

  const [get, {data, loading, error}] =
    useLazyGetRequest<EntityResponse<User>>();

  useEffect(() => {
    if (id) {
      get(UrlBuilder.user(id));
    }
  }, [id, session]);

  if (!id) {
    return null;
  }

  if (loading) {
    return null;
  }

  if (error || data?.result === 'error' || !data) {
    return null;
  }

  const user = data.data;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
      }}>
      <Image
        source={{uri: 'https://mangadex.org/avatar.png'}}
        style={{width: 20, aspectRatio: 1, borderRadius: 20, marginRight: 5}}
      />
      <Text>{user.attributes.username}</Text>
    </View>
  );
}

function CustomListVisiblityBadge({customList}: Pick<Props, 'customList'>) {
  const visibilityInfo =
    customList.attributes.visibility === 'private'
      ? {
          name: 'Private',
          background: 'error',
        }
      : {
          name: 'Public',
          background: 'accent',
        };

  return (
    <TextBadge
      content={visibilityInfo.name}
      background={visibilityInfo.background as BackgroundColor}
    />
  );
}
