import {Field} from '@shopify/react-form';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {contentRatingInfo, preferredTagName} from 'src/api';
import {
  ContentRating,
  Manga,
  PublicationDemographic,
} from 'src/api/mangadex/types';
import {BackgroundColor} from 'src/components/colors';
import TextBadge from 'src/components/TextBadge';
import {useContentRatingFitlers} from 'src/prodivers';
import {useFiltersContext} from '../MangaSearchFilter';
import {contentRatingName} from './ContentRatingFilter';
import {publicationDemographicName} from './PublicationDemographicFilter';
import {statusName} from './PublicationStatusFilter';
import {tagSelectionColorIconInfo} from './TagsFilter';

export function PreviewFilters() {
  const {tags, fields} = useFiltersContext();
  const contentRatings = useContentRatingFitlers();

  const {included: includedTagInfo, excluded: excludedTagInfo} =
    tagSelectionColorIconInfo();

  const getTagName = (tagId: string) => {
    return preferredTagName(tags.find(tag => tag.id === tagId)!);
  };

  return (
    <>
      <ShowFields
        field={fields.contentRating}
        allPossibleState={{
          values: contentRatings,
          content: 'Allowed content ratings',
        }}
        EmptyState={
          <TextBadge
            content="Allowed content ratings"
            background="placeholder"
            // onPress={() => fields.contentRating.onChange(contentRatings)}
          />
        }
        getContent={contentRatingName}
        getBackground={contentRating =>
          contentRatingInfo(contentRating).background
        }
      />
      <ShowFields
        field={fields.publicationDemographic}
        allPossibleState={{
          values: Object.values(PublicationDemographic),
          content: 'All demographics',
        }}
        EmptyState={
          <TextBadge content="Any demographic" background="placeholder" />
        }
        getContent={publicationDemographicName}
        getBackground={() => 'placeholder'}
      />
      <ShowFields field={fields.status} getContent={statusName} />
      <ShowFields
        field={fields.includedTags}
        getContent={getTagName}
        getIcon={() => includedTagInfo.icon}
        getBackground={() => includedTagInfo.background}
      />
      <ShowFields
        field={fields.excludedTags}
        getContent={getTagName}
        getIcon={() => excludedTagInfo.icon}
        getBackground={() => excludedTagInfo.background}
      />
      {/* <ShowFields
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
      /> */}
    </>
  );
}

function ShowFields<T>({
  field,
  EmptyState,
  allPossibleState,
  onChange: customOnChange,
  getContent,
  getKey,
  getIcon,
  getBackground,
}: {
  field: Field<T[] | undefined>;
  EmptyState?: React.ReactNode;
  allPossibleState?: {values: T[]; content: string};
  onChange?: (value: T[] | undefined) => void;
  getContent?: (value: T) => React.ReactNode;
  getKey?: (value: T) => string;
  getIcon?: (value: T) => string;
  getBackground?: (value: T) => BackgroundColor;
}) {
  const {value: values, dirty, onChange} = field;
  const onChangeCallback = customOnChange || onChange;

  const [showAllPossibleValuesSeparately, setShowAllPossibleValuesSeparately] =
    useState(false);

  useEffect(() => {
    // when the state is clean, go back to showing all possibles values
    // in one tag.
    if (!dirty) {
      setShowAllPossibleValuesSeparately(false);
    }
  }, [dirty]);

  if (!values?.length) {
    return <>{EmptyState}</>;
  }

  if (allPossibleState && !showAllPossibleValuesSeparately) {
    const {values: possibleValues, content} = allPossibleState;
    if (
      possibleValues.length === values.length &&
      possibleValues.every(value => values.includes(value))
    ) {
      return (
        <TextBadge
          content={content}
          background="placeholder"
          onPress={() => {
            setShowAllPossibleValuesSeparately(true);
            field.onChange(possibleValues);
          }}
        />
      );
    }
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
            onPress={() => onChangeCallback(values?.filter(v => v !== value))}
          />
        );
      })}
    </>
  );
}
