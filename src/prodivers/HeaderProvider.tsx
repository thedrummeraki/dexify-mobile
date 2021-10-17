import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface HeaderMenuItem {
  content: string;
  onAction: () => void;
}

interface HeaderState {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  hideHeader?: boolean;
  menuItems?: HeaderMenuItem[];
}

type HeaderContextState = HeaderState & {
  setState: (
    state: HeaderState | ((state: HeaderState) => HeaderState),
  ) => void;
  query: string;
  onSearch: (query: string) => void;
};

const defaultState: HeaderState = {
  title: 'Dexify',
  showSearch: false,
  hideHeader: false,
  menuItems: [],
  subtitle: '',
};

const defaultContextState: HeaderContextState = {
  ...defaultState,
  query: '',
  onSearch: (_: string) => {},
  setState: () => {},
};

export default function HeaderProvider({children}: PropsWithChildren<{}>) {
  const [state, setState] = useState(defaultState);
  const [query, setQuery] = useState('');

  const onSearch = useCallback(
    (query: string) => {
      if (state.showSearch) {
        setQuery(query);
      } else {
        setQuery('');
      }
    },
    [state.showSearch],
  );

  return (
    <HeaderContext.Provider value={{...state, setState, query, onSearch}}>
      {children}
    </HeaderContext.Provider>
  );
}

export const HeaderContext = React.createContext(defaultContextState);

export function useHeader(state: HeaderState) {
  const {setState, ...contextState} = useContext(HeaderContext);

  useEffect(() => {
    setState((oldState: HeaderState) => ({...oldState, ...state}));
  }, []);

  return {...contextState};
}
