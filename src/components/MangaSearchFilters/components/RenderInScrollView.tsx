import React, {PropsWithChildren} from 'react';
import {ScrollView, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useFiltersContext} from '../MangaSearchFilter';

export interface RenderInScrollViewProps {
  hideOpenModalIcon?: boolean;
  onModalOpen(): void;
}

export function RenderInScrollView({
  hideOpenModalIcon,
  children,
  onModalOpen,
}: PropsWithChildren<RenderInScrollViewProps>) {
  const {dirty, filtersPresent, submit, reset} = useFiltersContext();

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}>
      {!hideOpenModalIcon ? (
        <IconButton icon="filter-variant" onPress={onModalOpen} />
      ) : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {children}
        </View>
      </ScrollView>
      {dirty ? <IconButton icon="check" onPress={() => submit()} /> : null}
      {filtersPresent ? <IconButton icon="close" onPress={reset} /> : null}
    </View>
  );
}
