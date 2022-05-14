import React, {PropsWithChildren} from 'react';
import FullScreenModal from 'src/components/FullScreenModal';
import {useFiltersContext} from '../MangaSearchFilter';
import {useRenderContext} from './RenderContext';

interface Props {
  modalOpen: boolean;
  onModalOpen(modalOpen: boolean): void;
}

export function RenderInModal({
  children,
  modalOpen,
  onModalOpen,
}: PropsWithChildren<Props>) {
  const {dirty, submit, reset} = useFiltersContext();

  return (
    <FullScreenModal
      visible={modalOpen}
      title="Filter manga by..."
      onDismiss={() => onModalOpen(false)}
      primaryAction={{
        content: 'Apply',
        onAction: () => {
          submit();
          onModalOpen(false);
        },
      }}
      secondaryAction={{
        content: 'Reset',
        onAction: reset,
        disabled: !dirty,
      }}>
      {children}
    </FullScreenModal>
  );
}
