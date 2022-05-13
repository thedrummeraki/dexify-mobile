import React, {PropsWithChildren, useEffect, useState} from 'react';
import {Text} from 'react-native-paper';
import {useSession, useUpdatedSession} from 'src/prodivers';

interface Props {
  authRequired?: boolean;
}

export default function Authenticated({
  authRequired,
  children,
}: PropsWithChildren<Props>) {
  const {session, loading, refreshToken} = useUpdatedSession();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authRequired && session && !loading) {
      refreshToken()
        .then(res => {
          if (res?.result === 'ok') {
            console.log('token refreshed!!!');
          } else {
            console.log('token not refreshed.');
          }
        })
        .catch(console.error)
        .finally(() => {
          setReady(true);
        });
    }
  }, [loading, session, authRequired, refreshToken]);

  if (!authRequired || ready) {
    return <>{children}</>;
  }

  if (!session && authRequired) {
    return <Text>Not authenticated</Text>;
  }

  return <Text>loading {loading ? 'true' : 'false'}</Text>;
}
