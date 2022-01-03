import React, {PropsWithChildren} from 'react';
import {View} from 'react-native';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';

interface Props {
  title: string;
}

export default function EmptySectionState({
  children,
  title,
}: PropsWithChildren<Props>) {
  return (
    <>
      <CategoriesCollectionSection
        title={title}
        data={[]}
        renderItem={() => null}
      />
      <View style={{marginTop: -30, marginHorizontal: 15, marginBottom: 15}}>
        {children}
      </View>
    </>
  );
}
