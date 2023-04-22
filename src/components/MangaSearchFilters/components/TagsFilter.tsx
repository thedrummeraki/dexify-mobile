import React, {useMemo, useState} from 'react';
import {preferredTitle} from 'src/api';
import {useFiltersContext} from '../MangaSearchFilter';
import {Section} from './Section';
import {FilterButton} from './FilterButton';
import {Chip} from 'react-native-paper';
import {Manga} from 'src/api/mangadex/types';
import {Field} from '@shopify/react-form';
import {useBackgroundColor} from 'src/components/colors';

export function TagsFilter() {
  const {tags} = useFiltersContext();

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

  return (
    <Section
      title="Tags"
      values={visibleTags}
      style="wrap"
      renderItem={tag => <RenderTag key={tag.id} tag={tag} />}
      search={{onQuery: setQuery, placeholder: 'Search for tags...'}}
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
      onApply={() => submit()}
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
      onApply={() => submit()}
      onDismiss={fields.excludedTags.reset}
      onSelectionChange={fields.excludedTags.onChange}
    />
  );
}

export function tagSelectionColorIconInfo() {
  return {
    included: {
      background: 'accent',
      icon: 'check',
    },
    excluded: {
      background: 'error',
      icon: 'close',
    },
    default: {
      background: 'background',
      icon: 'plus',
    },
  } as const;
}

function RenderTag({tag}: {tag: Manga.Tag}) {
  const {fields} = useFiltersContext();

  const included = fields.includedTags.value?.includes(tag.id);
  const excluded = fields.excludedTags.value?.includes(tag.id);

  const {
    included: includedInfo,
    excluded: excludedInfo,
    default: defaultInfo,
  } = tagSelectionColorIconInfo();

  const info = included ? includedInfo : excluded ? excludedInfo : defaultInfo;

  const {icon, background} = info;
  const backgroundColor = useBackgroundColor(background);

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

  return (
    <Chip
      key={tag.id}
      style={{marginRight: 5, marginBottom: 5, backgroundColor}}
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
}
