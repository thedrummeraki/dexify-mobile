import React, {useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import {Title, Button, IconButton, Caption} from 'react-native-paper';
import {findRelationship} from 'src/api';
import {CustomList, EntityResponse, User} from 'src/api/mangadex/types';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {useLazyGetRequest} from 'src/api/utils';
import {TextBadge} from 'src/components';
import {BackgroundColor} from 'src/components/colors';

interface Props {
  customList: CustomList;
  onEditing(editing: boolean): void;
}

export default function CustomListActions({customList, onEditing}: Props) {
  return (
    <View style={{marginBottom: 20}}>
      <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
        <Text style={{marginRight: 5}}>This list is</Text>
        <CustomListVisiblityBadge customList={customList} />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View
          style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
          <IconButton icon="pencil-outline" onPress={() => onEditing(true)} />
          <IconButton disabled icon="book-plus" />
        </View>
        <IconButton icon="delete-forever" />
      </View>
    </View>
  );
}

function CustomListVisiblityBadge({customList}: Pick<Props, 'customList'>) {
  const visibilityInfo: {name: string; background: BackgroundColor} =
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
      background={visibilityInfo.background}
    />
  );
}

// function UserInfo({customList}: Pick<Props, 'customList'>) {
//   const id = findRelationship(customList, 'user')?.id;
//   const session = useSession();

//   const [get, {data, loading, error}] =
//     useLazyGetRequest<EntityResponse<User>>();

//   useEffect(() => {
//     if (id) {
//       get(UrlBuilder.user(id));
//     }
//   }, [get, id, session]);

//   if (!id) {
//     return null;
//   }

//   if (loading) {
//     return null;
//   }

//   if (error || data?.result === 'error' || !data) {
//     return null;
//   }

//   const user = data.data;

//   return (
//     <View
//       style={{
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 3,
//       }}>
//       <Image
//         source={{uri: 'https://mangadex.org/avatar.png'}}
//         style={{width: 20, aspectRatio: 1, borderRadius: 20, marginRight: 5}}
//       />
//       <Text>{user.attributes.username}</Text>
//     </View>
//   );
// }
