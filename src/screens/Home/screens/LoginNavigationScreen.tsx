import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button, Text, TextInput, Title} from 'react-native-paper';
import {AuthResponse} from 'src/api/mangadex/types';
import {useLazyGetRequest, usePostRequest} from 'src/api/utils';
import {SessionContext} from 'src/prodivers';

export function LoginNavigationScreen() {
  const [post] = usePostRequest<AuthResponse>();
  const [submitEnabled, setSubmitEnabled] = useState(false);
  // const [get] = useLazyGetRequest<{result: 'ok', isAuthenticated: boolean, roles: string[], permissions: string[]}>()
  const {session, setSession} = useContext(SessionContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setSubmitEnabled(password.length >= 8 && Boolean(username));
  }, [username, password]);

  // useEffect(() => {
  //   if (data.data?.result === 'ok') {
  //     const {token} = data.data;

  //     setSession({
  //       username,
  //       session: {
  //         value: token.session,
  //         validUntil: new Date(),
  //       },
  //       refresh: {
  //         value: token.session,
  //         validUntil: new Date(),
  //       },
  //     });
  //   }
  // }, [data]);

  const onLoginPressed = useCallback(() => {
    setSubmitEnabled(false);
    post('https://api.mangadex.org/auth/login', {
      username,
      password,
    })
      .then(result => {
        setSubmitEnabled(result?.result === 'error');
        if (result?.result === 'ok') {
          const {token} = result;

          setSession({
            username,
            session: {
              value: token.session,
              validUntil: new Date(new Date().getTime() + 14 * 60 * 1000), // 14 minutes
            },
            refresh: {
              value: token.refresh,
              validUntil: new Date(
                new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days
              ),
            },
          });
        }
      })
      .catch(() => setSubmitEnabled(true));
  }, [username, password]);

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
          disabled={!submitEnabled}
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
