import React, {PropsWithChildren} from 'react';
import {ScrollView, View} from 'react-native';
import {
  Title,
  Chip,
  Subheading,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import {findRelationships} from 'src/api';
import {Author, Artist, Manga} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {ChipsContainer} from 'src/components';

interface Props {
  manga: Manga;
  loading: boolean;
  aggregate?: Manga.VolumeAggregateInfo;
}

export default function DetailsTab({manga, loading, aggregate}: Props) {
  const authors = findRelationships<Author>(manga, 'author');
  const artists = findRelationships<Artist>(manga, 'artist');

  return (
    <ScrollView style={{padding: 5, flex: 1}}>
      <TabSection title="Basic information">
        <TabSectionEntryInfo
          title="Publication"
          description={manga.attributes.status}
        />
        <TabSectionEntryInfo
          title="Content rating"
          description={manga.attributes.contentRating}
        />
        <TabSectionEntryInfo
          title="Original language"
          description={manga.attributes.originalLanguage}
        />
        <TabSectionEntryInfo
          title="Demographic"
          description={manga.attributes.publicationDemographic}
        />
        <TabSectionEntryInfo
          title="Last chapter"
          description={manga.attributes.lastChapter}
        />
        <TabSectionEntryInfo title="Year" description={manga.attributes.year} />
      </TabSection>
      {/* <TabSection title="External Links"></TabSection> */}
      <TabSection title="Written by">
        <ChipsContainer
          data={authors}
          keyExtractor={author => author.id}
          style={{marginTop: 7, marginBottom: 8, marginHorizontal: -3}}
          itemStyle={{paddingHorizontal: 3, paddingVertical: 5}}
          renderChip={author => (
            <Chip icon="account">{author.attributes.name || author.id}</Chip>
          )}
        />
      </TabSection>
      <TabSection title="Illustrated by">
        <ChipsContainer
          data={artists}
          keyExtractor={artist => artist.id}
          style={{marginTop: 7, marginBottom: 8, marginHorizontal: -3}}
          itemStyle={{paddingHorizontal: 3, paddingVertical: 5}}
          renderChip={artist => (
            <Chip icon="palette">{artist.attributes.name || artist.id}</Chip>
          )}
        />
      </TabSection>
      <TabSection title="Volumes information">
        {loading ? (
          <ActivityIndicator />
        ) : (
          <ChaptersInformation aggregate={aggregate} />
        )}
      </TabSection>
      <TabSection title="Alternative titles">
        {manga.attributes.altTitles.map(titleInfo => {
          const entries = Object.entries(titleInfo)[0];
          const language = entries[0];
          const title = entries[1];

          return (
            <TabSectionEntryInfo
              key={title}
              title={language}
              description={title}
            />
          );
        })}
      </TabSection>
    </ScrollView>
  );
}

function ChaptersInformation({
  aggregate,
}: {
  aggregate?: Manga.VolumeAggregateInfo;
}) {
  const aggregateEntries = aggregate ? Object.entries(aggregate) : [];
  if (aggregateEntries.length === 0) {
    return null;
  }

  const volumesCount = aggregateEntries.length;
  const chaptersCount = aggregateEntries
    .map(entry => entry[1].count)
    .reduce((acc, count) => acc + count);

  return (
    <View>
      <TabSectionEntryInfo title="Volumes" description={volumesCount} />
      <TabSectionEntryInfo title="Chapters" description={chaptersCount} />
    </View>
  );
}

function TabSection({title, children}: PropsWithChildren<{title: string}>) {
  return (
    <View style={{marginBottom: 10}}>
      <Title>{title}</Title>
      {children}
    </View>
  );
}

function TabSectionEntryInfo({
  title,
  description,
  defaultValue = '~Unknown~',
  hideWhenEmpty = true,
}: {
  title: string;
  description?: React.ReactNode;
  defaultValue?: string;
  hideWhenEmpty?: boolean;
}) {
  if (hideWhenEmpty && !description) {
    return null;
  }
  return (
    <Subheading>
      {title}:{' '}
      <Text style={{fontWeight: 'bold'}}>{description || defaultValue}</Text>
    </Subheading>
  );
}
