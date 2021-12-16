import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Image, Linking, View} from 'react-native';
import {Button, Caption, Text, TextInput, Title} from 'react-native-paper';
import {AuthResponse} from 'src/api/mangadex/types';
import {useLazyGetRequest, usePostRequest} from 'src/api/utils';
import {SessionContext} from 'src/prodivers';

export function LoginNavigationScreen() {
  const [post] = usePostRequest<AuthResponse>();
  const [submitEnabled, setSubmitEnabled] = useState(false);
  // const [get] = useLazyGetRequest<{result: 'ok', isAuthenticated: boolean, roles: string[], permissions: string[]}>()
  const {setSession} = useContext(SessionContext);

  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setSubmitEnabled(password.length >= 8 && Boolean(username));
  }, [username, password]);

  const handleGoToMangadex = () => {
    Linking.openURL('https://mangadex.org/login');
  };

  const onLoginPressed = useCallback(() => {
    setSubmitEnabled(false);
    setSubmitting(true);
    post('https://api.mangadex.org/auth/login', {
      username,
      password,
    })
      .then(result => {
        setSubmitEnabled(result?.result === 'error');
        if (result?.result === 'ok') {
          const {token} = result;

          setSession({
            username: username.toLocaleLowerCase(),
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
      .catch(() => setSubmitEnabled(true))
      .finally(() => setSubmitting(false));
  }, [username, password]);

  return (
    <View
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
      <View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 30,
          }}>
          <Image
            source={require('src/images/logo-face-only.png')}
            width={100}
            height={100}
            style={{width: 100, height: 100, borderRadius: 25, margin: 10}}
          />
          <Text style={{textAlign: 'center'}}>
            Discover and read manga from the comfort of your mobile device!
          </Text>
          <Caption>Sign in with your Mangadex account</Caption>
        </View>
        <TextInput
          dense
          mode="outlined"
          onChangeText={setUsername}
          placeholder="👤 username"
        />
        <TextInput
          dense
          secureTextEntry
          mode="outlined"
          textContentType="password"
          passwordRules="required"
          keyboardType="default"
          autoCompleteType="password"
          placeholder="🤫 password"
          onChangeText={setPassword}
        />
        <Button
          loading={submitting}
          disabled={!submitEnabled}
          mode="contained"
          icon="lock"
          style={{marginTop: 7}}
          onPress={onLoginPressed}>
          Sign in
        </Button>
      </View>
      <Caption
        style={{marginTop: 30, fontStyle: 'italic', lineHeight: 16}}
        onPress={handleGoToMangadex}>
        Have trouble logging in? Don't have an account? Click here to go to
        https://www.mangadex.org/login for more info.
      </Caption>
    </View>
  );
}
