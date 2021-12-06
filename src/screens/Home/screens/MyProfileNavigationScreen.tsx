import React, {useContext} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Image, ScrollView, TouchableNativeFeedback, View} from 'react-native';
import {Button, Switch, Text, Title, useTheme} from 'react-native-paper';
import {usePostRequest} from 'src/api/utils';
import {SessionContext} from 'src/prodivers';

interface TogglableSettingsItemProps {
  value: boolean;
  title: string;
  disabled?: boolean;
  description?: string;
  onPress?(): void;
}

export function MyProfileNavigationScreen() {
  const {session, setSession} = useContext(SessionContext);

  const [logout] = usePostRequest('/auth/logout');

  const handleLogout = () => {
    if (!session) {
      return;
    }

    logout()
      .then(() => EncryptedStorage.removeItem('user_session'))
      .then(() => setSession(null))
      .catch(console.error);
  };

  if (!session) {
    return null;
  }

  return (
    <ScrollView>
      <View style={{flex: 1, alignItems: 'center', marginTop: 20}}>
        <Image
          source={{uri: `https://api.multiavatar.com/${session.username}.png`}}
          style={{width: 200, aspectRatio: 1, borderRadius: 200}}
        />
        <Title style={{margin: 15}}>{session.username}</Title>
      </View>
      <TogglableSettingsItem disabled value={false} title="Enable spicy mode" />
      <View style={{margin: 15}}>
        <Button mode="contained" onPress={handleLogout}>
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}

function TogglableSettingsItem({
  value,
  title,
  disabled,
  description,
  onPress,
}: TogglableSettingsItemProps) {
  const theme = useTheme();
  return (
    <TouchableNativeFeedback
      useForeground
      onPress={disabled ? undefined : onPress}>
      <View
        style={{
          padding: 15,
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{color: disabled ? theme.colors.disabled : theme.colors.text}}>
          {title}
        </Text>
        <Switch disabled={disabled} value={value} />
      </View>
    </TouchableNativeFeedback>
  );
}
