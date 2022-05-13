import {
  Field,
  useField,
  useForm,
  useDynamicList,
  FieldBag,
} from '@shopify/react-form';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ContentRating,
  MangaOrder,
  MangaRequestParams,
  MangaStatus,
  PublicationDemographic,
  TagMode,
} from 'src/api/mangadex/types';
import FullScreenModal from './FullScreenModal';
import TextBadge from './TextBadge';

type AllowedFilterKeys = Exclude<keyof MangaRequestParams, 'order'>;

interface Props<T extends keyof MangaRequestParams> {
  keys: Array<T>;
  onFiltersApply(appliedFilters: Pick<MangaRequestParams, T>): void;
}

interface Enableable<T> {
  enabled?: boolean;
  value: T;
}

const defaultFilters: MangaRequestParams = {
  includedTags: [],
  includedTagsMode: TagMode.AND,
  excludedTags: [],
  excludedTagsMode: TagMode.OR,
  status: [],
  originalLanguage: [],
  excludedOriginalLanguage: [],
  availableTranslatedLanguage: [],
  publicationDemographic: [],
  contentRating: [],
  order: {
    createdAt: 'asc',
    followedCount: 'desc',
    relevance: 'asc',
    updatedAt: 'asc',
  },
};

function useDynamicFilters<T extends keyof MangaRequestParams>(keys: T[]) {
  type Filters<T extends keyof MangaRequestParams> = Pick<
    MangaRequestParams,
    T
  >;
  const filters = Object.fromEntries(
    keys.map(key => [key, defaultFilters[key]]),
  );

  return filters as Filters<T>;
}

type FitlersFieldBag<T extends keyof MangaRequestParams> = Pick<
  {
    [P in T]?: Field<MangaRequestParams[P]>;
  },
  T
>;

function useFields<T extends keyof MangaRequestParams>(
  filters: MangaRequestParams,
): FitlersFieldBag<T> {
  const entries = Object.entries(filters);

  const fieldEntries = entries.map(entry => {
    const [key, value] = entry as [T, MangaRequestParams[T]];
    const field = useField<MangaRequestParams[T]>(value);

    return [key, field];
  });

  return Object.fromEntries(fieldEntries) as FitlersFieldBag<T>;
}

export default function MangaSearchFilters<T extends keyof MangaRequestParams>({
  keys,
  onFiltersApply,
}: Props<T>) {
  const filters = useDynamicFilters(keys);
  const fields = useFields(filters);

  const form = useForm({
    fields,
    onSubmit: async fields => {
      onFiltersApply(fields);
      return {errors: [], status: 'success'};
    },
  });

  return (
    <ScrollView horizontal>
      {keys.map(key => {
        const field = form.fields[key];

        if (!field || !Array.isArray(field.value)) {
          return null;
        }

        return (
          <FilterButton
            key={key}
            values={field.value}
            currentValues={[]}
            name={key}
            onApply={() => {}}
            onDismiss={() => {}}
          />
        );
      })}
    </ScrollView>
  );
}

function FilterButton<T>({
  values,
  currentValues,
  multiple,
  name,
  icon,
  getName,
  compare,
  onApply,
  onDismiss,
}: {
  values: T[];
  currentValues: T[];
  name: string;
  multiple?: boolean;
  icon?: string;
  getName?: (value: T) => string;
  compare?: (a: T, b: T) => number;
  onApply: (values: T[]) => void;
  onDismiss: () => void;
}) {
  const {
    colors: {surface: background},
  } = useTheme();
  const [visible, setVisible] = useState(false);
  const handleDismiss = useCallback(() => {
    onDismiss();
    setVisible(false);
  }, []);

  const handleApply = useCallback((values: T[]) => {
    onApply(values);
    setVisible(false);
  }, []);

  const [selectedValues, setSelectedValue] = useState<T[]>(currentValues);

  const itemSelected = useCallback(
    (item: T) => {
      if (compare) {
        return selectedValues.filter(x => compare(item, x) === 0).length > 0;
      } else {
        return selectedValues.includes(item);
      }
    },
    [selectedValues, compare],
  );

  return (
    <TouchableNativeFeedback onPress={() => setVisible(true)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: background,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 50,
        }}>
        <Text style={{color: '#fff'}}>{name}</Text>
        {icon ? (
          <Icon
            name={icon}
            style={{fontSize: 18, color: '#fff', marginLeft: 5}}
          />
        ) : null}
        <FullScreenModal
          visible={visible}
          title={name}
          onDismiss={handleDismiss}
          primaryAction={{
            content: 'Apply',
            onAction: () => handleApply(selectedValues),
          }}>
          <FlatList
            data={values}
            renderItem={({item}) => {
              const selected = itemSelected(item);

              return (
                <TouchableNativeFeedback
                  onPress={() => {
                    if (selected) {
                      setSelectedValue(current =>
                        current.filter(x => item !== x),
                      );
                    } else {
                      setSelectedValue(current => [...current, item]);
                    }
                  }}>
                  <View
                    style={{
                      padding: 15,
                    }}>
                    <TextBadge
                      style={{marginLeft: -5}}
                      icon={selected ? 'check' : undefined}
                      content={<Text>{getName?.(item) || String(item)}</Text>}
                      background="none"
                    />
                  </View>
                </TouchableNativeFeedback>
              );
            }}
          />
        </FullScreenModal>
      </View>
    </TouchableNativeFeedback>
  );
}
