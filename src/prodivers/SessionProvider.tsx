import React, {PropsWithChildren, useContext, useState} from 'react';
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

  return (
    <SessionContext.Provider value={{session, setSession}}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const {session} = useContext(SessionContext);
  return session || null;
}
