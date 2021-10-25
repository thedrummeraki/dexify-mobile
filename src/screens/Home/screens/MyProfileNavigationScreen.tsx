import React from 'react';
import {Text} from 'react-native-paper';
import {useSession} from 'src/prodivers';

export function MyProfileNavigationScreen() {
  const session = useSession();

  return <Text>My profile {session!.username}</Text>;
}
