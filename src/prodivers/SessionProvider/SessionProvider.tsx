import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import SessionRefresher from './SessionRefresher';

interface Session {
  value: string;
  validUntil: Date;
}

export interface SessionState {
  session: Session;
  refresh: Session;
  username: string;
}

interface ContextState {
  session?: SessionState | null;
  setSession: (
    session:
      | SessionState
      | null
      | ((session: SessionState | null) => SessionState | null),
  ) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const SessionContext = React.createContext<ContextState>({
  session: null,
  setSession: () => console.log('{NOOP} setSession'),
  loading: false,
  setLoading: () => console.log('{NOOP} setLoading'),
});

export default function SessionProvider({children}: PropsWithChildren<{}>) {
  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      storeSession(session).then(success => {
        if (success) {
          console.log('session successfully stored');
        } else {
          console.warn('session was not successfully stored!');
        }
      });
    }
  }, [session]);

  return (
    <SessionContext.Provider
      value={{
        session,
        loading,
        setSession: session => {
          console.log('setting session', session);
          setSession(session);
        },
        setLoading,
      }}>
      <SessionRefresher
        loading={loading}
        onLoading={setLoading}
        onSession={setSession}>
        {children}
      </SessionRefresher>
    </SessionContext.Provider>
  );
}

async function storeSession(session: SessionState) {
  try {
    await EncryptedStorage.setItem('user_session', JSON.stringify(session));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function useSession() {
  const {session} = useContext(SessionContext);
  return session || null;
}

export function useIsLoggedIn() {
  return Boolean(useSession());
}

export function checkSessionValidity(token?: Session) {
  return token ? token.validUntil > new Date() : false;
}
