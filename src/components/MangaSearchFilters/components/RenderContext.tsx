import React, {useContext} from 'react';
import {useFiltersContext} from '../MangaSearchFilter';

type DisplayMode = 'modal' | 'scroll';

interface ContextState {
  mode: DisplayMode;
}

const Context = React.createContext<ContextState | null>(null);

interface BasicProps {
  mode: DisplayMode;
  children: React.ReactNode;
}

interface ScrollModeProps extends BasicProps {
  mode: 'scroll';
}

interface ModalModeProps extends BasicProps {
  mode: 'modal';
}

type Props = ScrollModeProps | ModalModeProps;

export function RenderContext({mode, children}: Props) {
  useFiltersContext();

  return (
    <Context.Provider value={{mode}}>
      <>{children}</>
    </Context.Provider>
  );
}

export function useRenderContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('This component must be used within a <RenderContext>');
  }
  return context;
}
