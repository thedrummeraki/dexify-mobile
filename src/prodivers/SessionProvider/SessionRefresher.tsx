import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {ActivityIndicator, Text} from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import {checkSessionValidity, SessionContext, SessionState} from '.';
import {AxiosRequestType, useAxiosRequest, usePostRequest} from 'src/api/utils';
import {AuthResponse} from 'src/api/mangadex/types';
import axios from 'axios';
import SplashScreen from 'src/components/SplashScreen';

interface Props {
  loading: boolean;
  onLoading: (loading: boolean) => void;
  onSession: (session: SessionState) => void;
}

export default function SessionRefresher({
  children,
  loading,
  onLoading,
  onSession,
}: PropsWithChildren<Props>) {
  const {session} = useContext(SessionContext);
  const {refreshToken} = useUpdatedSession();

  useEffect(() => {
    if (session) {
      return;
    }

    retrieveStoredSession()
      .then(retrievedSession => {
        if (retrievedSession) {
          const sessionValidForMs =
            retrievedSession.session.validUntil.getTime() -
            new Date().getTime();

          if (checkSessionValidity(retrievedSession.session)) {
            console.log('still valid for', sessionValidForMs / 1000, 'seconds');
            onLoading(false);
            onSession(retrievedSession);
          } else {
            refreshToken(retrievedSession).finally(() => onLoading(false));
          }
        } else {
          onLoading(false);
        }
      })
      .catch(() => onLoading(false));
  }, [session]);

  if (loading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

async function retrieveStoredSession(): Promise<SessionState | null> {
  try {
    const retrieved = await EncryptedStorage.getItem('user_session');
    if (retrieved) {
      const parsed = JSON.parse(retrieved);
      return {
        username: parsed.username,
        refresh: {
          value: parsed.refresh.value,
          validUntil: new Date(Date.parse(parsed.refresh.validUntil)),
        },
        session: {
          value: parsed.session.value,
          validUntil: new Date(Date.parse(parsed.session.validUntil)),
        },
      };
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function useUpdatedSession(refreshNow = true) {
  const {loading, session: token, setSession} = useContext(SessionContext);

  const refreshToken = useCallback(
    async (otherToken?: SessionState | null, options?: {force?: boolean}) => {
      // console.log('token', Boolean(token));
      let tokenToUpdate = token || otherToken || null;
      if (!tokenToUpdate) {
        tokenToUpdate = await retrieveStoredSession();
        if (tokenToUpdate) {
          setSession(tokenToUpdate);
        } else {
          console.log('there is no token to update with.');
          return undefined;
        }
      }

      const {refresh, session} = tokenToUpdate;

      if (!options?.force) {
        if (!checkSessionValidity(refresh) || checkSessionValidity(session)) {
          return;
        }

        if (!checkSessionValidity(refresh)) {
          return null;
        }
      } else {
        console.log('forcing the refresh to happen');
      }

      try {
        const response = await axios.post<AuthResponse>(
          'https://api.mangadex.org/auth/refresh',
          {
            token: refresh.value,
          },
        );

        console.log('token resfresh res', {response});

        const {data} = response;

        if (data?.result === 'ok') {
          const newSession = {
            ...tokenToUpdate,
            refresh: {
              value: data.token.refresh,
              validUntil: new Date(
                new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
              ),
            },
            session: {
              value: data.token.session,
              validUntil: new Date(new Date().getTime() + 14 * 60 * 1000),
            },
          };
          setSession(newSession);
        }

        return data || null;
      } catch (error) {
        console.error(error);
        setSession(null);
        return null;
      }
    },
    [token],
  );

  useEffect(() => {
    if (refreshNow && !loading) {
      refreshToken();
    }
  }, [refreshNow, loading]);

  return {loading, session: token, refreshToken};
}
