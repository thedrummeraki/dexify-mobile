import {Field} from '@shopify/react-form';
import React from 'react';
import {Chip} from 'react-native-paper';
import {Section} from './Section';

interface Props<T> {
  title: string;
  values: T[];
  field: Field<T[] | undefined>;
  searchable?: boolean;
}

export function BasicSection<T>(props: Props<T>) {
  const {field} = props;

  return (
    <Section
      {...props}
      renderItem={item => {
        const selected = field.value?.includes(item);
        return (
          <Chip
            selected={selected}
            style={{marginRight: 5}}
            onPress={() => {
              if (selected) {
                field.onChange(field.value?.filter(v => v !== item));
              } else {
                field.onChange([...(field.value || []), item]);
              }
            }}>
            {item}
          </Chip>
        );
      }}
    />
  );
}
