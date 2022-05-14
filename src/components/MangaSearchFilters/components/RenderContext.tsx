import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';
import {Text} from 'react-native-paper';
import {useFiltersContext} from '../MangaSearchFilter';
import {RenderInModal} from './RenderInModal';
import {RenderInScrollView} from './RenderInScrollView';

type DisplayMode = 'modal' | 'scroll';

interface ContextState {
  mode: DisplayMode;
}

const Context = React.createContext<ContextState | null>(null);

interface Props {
  mode: DisplayMode;
  children: React.ReactNode;
}

export function RenderContext({mode, children}: Props) {
  useFiltersContext();

  return (
    <Context.Provider value={{mode}}>
      <RenderInCorrectMode>{children}</RenderInCorrectMode>
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

function RenderInCorrectMode({children}: PropsWithChildren<{}>) {
  return <>{children}</>;
}
