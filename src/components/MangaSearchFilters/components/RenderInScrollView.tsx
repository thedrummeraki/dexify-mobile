import React, {PropsWithChildren} from 'react';
import {ScrollView, View} from 'react-native';
import {IconButton} from 'react-native-paper';

interface Props {
  onModalOpen(): void;
}

export function RenderInScrollView({
  children,
  onModalOpen,
}: PropsWithChildren<Props>) {
  return (
    <ScrollView horizontal>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 10,
        }}>
        <IconButton icon="filter-variant" onPress={onModalOpen} />
        {/* <Chip icon="sort-variant" style={{marginRight: 5}}>
            Order by...
          </Chip>
          <Chip icon="calendar-range" style={{marginRight: 5}}>
            Year
          </Chip> */}
        {children}
      </View>
    </ScrollView>
  );
}
