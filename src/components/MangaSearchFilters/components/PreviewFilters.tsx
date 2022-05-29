import {Field} from '@shopify/react-form';
import React from 'react';
import {View} from 'react-native';
import {contentRatingInfo, preferredTagName} from 'src/api';
import {Manga} from 'src/api/mangadex/types';
import {BackgroundColor} from 'src/components/colors';
import TextBadge from 'src/components/TextBadge';
import {useFiltersContext} from '../MangaSearchFilter';
import {contentRatingName} from './ContentRatingFilter';
import {publicationDemographicName} from './PublicationDemographicFilter';
import {statusName} from './PublicationStatusFilter';
import {tagSelectionColorIconInfo} from './TagsFilter';

export function PreviewFilters() {
  const {tags, fields} = useFiltersContext();
  const includedTags = tags.filter(tag =>
    fields.includedTags.value?.includes(tag.id),
  );
  const excludedTags = tags.filter(tag =>
    fields.excludedTags.value?.includes(tag.id),
  );

  const {included: includedTagInfo, excluded: excludedTagInfo} =
    tagSelectionColorIconInfo();

  return (
    <>
      <ShowFields
        values={fields.contentRating.value}
        // EmptyState={
        //   <TextBadge content="Any content rating" background="placeholder" />
        // }
        getContent={contentRatingName}
        onChange={fields.contentRating.onChange}
        getBackground={contentRating =>
          contentRatingInfo(contentRating).background
        }
      />
      <ShowFields
        values={fields.publicationDemographic.value}
        // EmptyState={
        //   <TextBadge content="Any demographic" background="placeholder" />
        // }
        getContent={publicationDemographicName}
        onChange={fields.publicationDemographic.onChange}
        getBackground={() => 'placeholder'}
      />
      <ShowFields
        values={fields.status.value}
        getContent={statusName}
        onChange={fields.status.onChange}
      />
      <ShowFields
        values={includedTags}
        getContent={tag => preferredTagName(tag)}
        getKey={tag => tag.id}
        onChange={tags => fields.includedTags.onChange(tags.map(tag => tag.id))}
        getIcon={() => includedTagInfo.icon}
        getBackground={() => includedTagInfo.background}
      />
      <ShowFields
        values={excludedTags}
        getContent={tag => preferredTagName(tag)}
        getKey={tag => tag.id}
        onChange={tags => fields.excludedTags.onChange(tags.map(tag => tag.id))}
        getIcon={() => excludedTagInfo.icon}
        getBackground={() => excludedTagInfo.background}
      />
    </>
  );
}

function ShowFields<T>({
  values,
  EmptyState,
  onChange,
  getContent,
  getKey,
  getIcon,
  getBackground,
}: {
  values: T[] | undefined;
  EmptyState?: React.ReactNode;
  onChange?: (values: T[]) => void;
  getContent?: (value: T) => React.ReactNode;
  getKey?: (value: T) => string;
  getIcon?: (value: T) => string;
  getBackground?: (value: T) => BackgroundColor;
}) {
  if (!values?.length) {
    return <>{EmptyState}</>;
  }

  return (
    <>
      {values?.map(value => {
        return (
          <TextBadge
            key={getKey ? getKey(value) : String(value)}
            icon={getIcon?.(value)}
            background={getBackground?.(value)}
            content={getContent ? getContent(value) : String(value)}
            onPress={() => onChange?.(values?.filter(v => v !== value))}
          />
        );
      })}
    </>
  );
}
