import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

interface Session {
  value: string;
  validUntil: Date;
}

interface SessionState {
  session: Session;
  refresh: Session;
  username: string;
}

interface ContextState {
  session?: SessionState | null;
  setSession: (session: SessionState | null) => void;
}

export const SessionContext = React.createContext<ContextState>({
  session: null,
  setSession: _ => {},
});

export default function SessionProvider({children}: PropsWithChildren<{}>) {
  const [session, setSession] = useState<SessionState | null>(null);

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

  useEffect(() => {
    retrieveStoredSession().then(session => {
      setSession(session);
      if (session) {
        console.log('successfully retrieved session!');
      } else {
        console.log('looks like no user is logged in.');
      }
    });
  }, []);

  return (
    <SessionContext.Provider value={{session, setSession}}>
      {children}
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

async function retrieveStoredSession(): Promise<SessionState | null> {
  try {
    const retrieved = await EncryptedStorage.getItem('user_session');
    if (retrieved) {
      const parsed = JSON.parse(retrieved);
      return parsed as SessionState;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function useSession() {
  const {session} = useContext(SessionContext);
  return session || null;
}
