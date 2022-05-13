import React, {useMemo, useState} from 'react';
import {preferredTitle} from 'src/api';
import {useFiltersContext} from '../MangaSearchFilter';
import {Section} from './Section';
import {FilterButton} from './FilterButton';
import {Chip, Paragraph} from 'react-native-paper';
import {Manga} from 'src/api/mangadex/types';
import {Field} from '@shopify/react-form';
import {View} from 'react-native';

export function TagsFilter() {
  const {fields, tags} = useFiltersContext();
  const handleTags = (
    tag: Manga.Tag,
    field: Field<string[] | undefined>,
    action: 'add' | 'remove',
  ) => {
    if (action === 'add') {
      field.onChange([...(field.value || []), tag.id]);
    } else {
      field.onChange(field.value?.filter(id => id !== tag.id));
    }
  };

  const [query, setQuery] = useState('');
  const visibleTags = useMemo(() => {
    return tags.filter(tag => {
      const {
        attributes: {name},
      } = tag;
      return Object.entries(name).some(([_, value]) => {
        return value.toLowerCase().includes(query.toLowerCase());
      });
    });
  }, [tags, query]);

  const includedTags = tags.filter(tag =>
    fields.includedTags.value?.includes(tag.id),
  );
  const excludedTags = tags.filter(tag =>
    fields.excludedTags.value?.includes(tag.id),
  );

  return (
    <Section
      title="Tags"
      values={visibleTags}
      renderItem={tag => {
        const included = fields.includedTags.value?.includes(tag.id);
        const excluded = fields.excludedTags.value?.includes(tag.id);

        const icon = included ? 'check' : excluded ? 'close' : 'plus';

        return (
          <Chip
            style={{marginRight: 5}}
            icon={icon}
            onPress={() => {
              if (included) {
                handleTags(tag, fields.includedTags, 'remove');
                handleTags(tag, fields.excludedTags, 'add');
              } else if (excluded) {
                handleTags(tag, fields.includedTags, 'remove');
                handleTags(tag, fields.excludedTags, 'remove');
              } else {
                handleTags(tag, fields.includedTags, 'add');
                handleTags(tag, fields.excludedTags, 'remove');
              }
            }}>
            {preferredTitle(tag.attributes.name)}
          </Chip>
        );
      }}
      search={{onQuery: setQuery, placeholder: 'Search for tags...'}}
      Description={
        <View>
          {includedTags.length > 0 ? (
            <Paragraph>
              With:{' '}
              {includedTags
                .map(tag => preferredTitle(tag.attributes.name))
                .join(', ')}
            </Paragraph>
          ) : null}
          {excludedTags.length > 0 ? (
            <Paragraph>
              Without:{' '}
              {excludedTags
                .map(tag => preferredTitle(tag.attributes.name))
                .join(', ')}
            </Paragraph>
          ) : null}
        </View>
      }
    />
  );
}

export function IncludedTagsFilter() {
  const {fields, tags, submit} = useFiltersContext();

  return (
    <FilterButton
      name="Include tags..."
      values={tags.map(tag => tag.id)}
      currentValues={fields.includedTags.value}
      getName={tagId =>
        preferredTitle(tags.find(tag => tag.id === tagId)?.attributes.name!)
      }
      onApply={submit}
      onDismiss={fields.includedTags.reset}
      onSelectionChange={fields.includedTags.onChange}
    />
  );
}

export function ExcludedTagsFilter() {
  const {fields, tags, submit} = useFiltersContext();

  return (
    <FilterButton
      name="Exclude tags..."
      values={tags.map(tag => tag.id)}
      currentValues={fields.excludedTags.value}
      getName={tagId =>
        preferredTitle(tags.find(tag => tag.id === tagId)?.attributes.name!)
      }
      onApply={submit}
      onDismiss={fields.excludedTags.reset}
      onSelectionChange={fields.excludedTags.onChange}
    />
  );
}
