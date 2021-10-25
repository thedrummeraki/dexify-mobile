import React, {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button, Text, TextInput, Title} from 'react-native-paper';
import {AuthResponse} from 'src/api/mangadex/types';
import {useLazyGetRequest, usePostRequest} from 'src/api/utils';
import {SessionContext} from 'src/prodivers';

export function LoginNavigationScreen() {
  const [post, data] = usePostRequest<AuthResponse>();
  // const [get] = useLazyGetRequest<{result: 'ok', isAuthenticated: boolean, roles: string[], permissions: string[]}>()
  const {session, setSession} = useContext(SessionContext);

  console.log(session);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (data.data?.result === 'ok') {
      const {token} = data.data;

      setSession({
        username,
        session: {
          value: token.session,
          validUntil: new Date(),
        },
        refresh: {
          value: token.session,
          validUntil: new Date(),
        },
      });
    }
  }, [data]);

  const onLoginPressed = () => {
    post('https://api.mangadex.org/auth/login', {
      username,
      password,
    });
  };

  return (
    <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
      <View>
        <Title>Sign in with your Mangadex account</Title>
        <TextInput mode="outlined" onChangeText={setUsername} />
        <TextInput
          secureTextEntry
          mode="outlined"
          textContentType="password"
          passwordRules="required"
          keyboardType="default"
          autoCompleteType="password"
          onChangeText={setPassword}
        />
        <Button
          disabled={
            password.length < 8 ||
            !username ||
            data.loading ||
            data.data?.result === 'ok'
          }
          mode="contained"
          icon="lock"
          style={{marginTop: 7}}
          onPress={onLoginPressed}>
          Sign in
        </Button>
      </View>
    </View>
  );
}
