import {DateTime} from 'luxon';
import React from 'react';
import {FormattedDisplayName, IntlProvider} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {Caption, Text, useTheme} from 'react-native-paper';
import {findRelationship, preferredChapterTitle} from 'src/api';
import {Chapter, ScanlationGroup} from 'src/api/mangadex/types';
import {TextBadge} from 'src/components';
import {localizedDateTime} from 'src/utils';

interface Props {
  chapter: Chapter;
  showSeparator: boolean;
}

export default function ChapterPreview({chapter, showSeparator}: Props) {
  const theme = useTheme();
  const scanlationGroup = findRelationship<ScanlationGroup>(
    chapter,
    'scanlation_group',
  );

  return (
    <View
      style={{borderColor: theme.colors.disabled, borderWidth: 0, padding: 4}}>
      <Text numberOfLines={1}>{preferredChapterTitle(chapter)}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: -1,
        }}>
        <TextBadge
          icon="clock"
          background="none"
          content={
            <Caption>
              {localizedDateTime(
                chapter.attributes.publishAt,
                DateTime.DATE_MED,
              )}
            </Caption>
          }
        />
        {scanlationGroup ? (
          <TextBadge
            icon="account-group"
            background="none"
            content={<Caption>{scanlationGroup.attributes.name}</Caption>}
          />
        ) : null}
      </View>
      <IntlProvider
        locale="en"
        textComponent={children => (
          <TextBadge
            icon="translate"
            background="none"
            style={{marginTop: -2}}
            content={<Caption children={children.children} />}
          />
        )}>
        <FormattedDisplayName
          value={chapter.attributes.translatedLanguage}
          type="language"
        />
      </IntlProvider>
      {showSeparator ? (
        <View style={{alignItems: 'center'}}>
          <Text style={{color: theme.colors.placeholder}}>・</Text>
        </View>
      ) : null}
    </View>
  );
}
