import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {ActivityIndicator, Text} from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import {checkSessionValidity, SessionContext, SessionState} from '.';
import {usePostRequest} from 'src/api/utils';
import {AuthResponse} from 'src/api/mangadex/types';

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
    return <ActivityIndicator style={{flex: 1}} />;
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

export function useUpdatedSession() {
  const {session: token, setSession} = useContext(SessionContext);
  const [post, response] = usePostRequest<AuthResponse>();

  const refreshToken = useCallback(
    async (otherToken?: SessionState) => {
      const tokenToUpdate = token || otherToken;
      if (!tokenToUpdate) {
        return undefined;
      }

      const {refresh, session} = tokenToUpdate;

      if (!checkSessionValidity(refresh) || checkSessionValidity(session)) {
        const reason = checkSessionValidity(session)
          ? 'session valid'
          : 'no valid refresh token found';
        console.log('no need to refresh. Reason:', reason);
        return;
      }

      if (!checkSessionValidity(refresh)) {
        return null;
      }

      try {
        const response = await post('https://api.mangadex.org/auth/refresh', {
          token: refresh.value,
        });

        if (response?.result === 'ok') {
          setSession({
            ...tokenToUpdate,
            refresh: {
              value: response.token.refresh,
              validUntil: new Date(
                new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
              ),
            },
            session: {
              value: response.token.session,
              validUntil: new Date(new Date().getTime() + 14 * 60 * 1000),
            },
          });
        }

        return response || null;
      } catch (error) {
        return null;
      }
    },
    [token],
  );

  useEffect(() => {
    refreshToken();
  }, []);

  return {session: token, refreshToken, ...response};
}
