import React, {useMemo, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Chip,
  IconButton,
  Text,
  TextInput,
} from 'react-native-paper';
import {preferredTitle} from 'src/api';
import {Manga, PagedResultsList, TagMode} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {CloseCurrentScreenHeader, MangaSearchCollection} from 'src/components';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {useShowMangaByTagsRoute} from 'src/foundation';
import {useSettings} from 'src/prodivers';
import {useDebouncedValue} from 'src/utils';

export default function ShowMangaByTags() {
  const {
    params: {tags: defaultTags},
  } = useShowMangaByTagsRoute();
  const [tags, setTags] = useState(defaultTags);
  const [query, setQuery] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');
  const [addingMoreTags, setAddingMoreTags] = useState(false);

  const {data: tagsData, loading: tagsLoading} = useGetRequest<
    PagedResultsList<Manga.Tag>
  >('https://api.mangadex.org/manga/tag');

  const possibleTags = useMemo(() => {
    if (tagsData?.result === 'ok') {
      return tagsData.data;
    }
    return [];
  }, [tagsData]);

  const filteredPossibleTags = useMemo(() => {
    const query = tagsFilter.toLocaleLowerCase().trim();
    if (!query) {
      return possibleTags;
    }

    return possibleTags.filter(tag =>
      preferredTitle(tag.attributes.name).toLocaleLowerCase().includes(query),
    );
  }, [tagsFilter, possibleTags]);

  const includedTags = useMemo(() => tags.map(t => t.id), [tags]);

  const contentRating = useSettings().contentRatings;
  const debouncedQuery = useDebouncedValue(query, 500);

  if (tagsLoading) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (defaultTags.length === 0 || possibleTags.length === 0) {
    return null;
  }

  const textFieldMarkup = addingMoreTags ? (
    <TextInput
      dense
      value={tagsFilter}
      onChangeText={setTagsFilter}
      placeholder="Filter tags..."
    />
  ) : (
    <TextInput
      dense
      value={query}
      onChangeText={setQuery}
      placeholder="Search for manga..."
    />
  );

  const bodyMarkup = addingMoreTags ? (
    <ScrollView>
      <View
        style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 15}}>
        {possibleTags.map(tag => (
          <Chip
            selected={includedTags.includes(tag.id)}
            style={{marginRight: 5, marginBottom: 5}}
            onPress={() => {
              if (includedTags.includes(tag.id)) {
                setTags(current =>
                  current.filter(addedTag => addedTag.id !== tag.id),
                );
              } else {
                setTags(current => [...current, tag]);
              }
            }}>
            {preferredTitle(tag.attributes.name)}
          </Chip>
        ))}
      </View>
    </ScrollView>
  ) : (
    <ScrollView>
      <MangaSearchCollection
        options={{
          includedTagsMode: TagMode.OR,
          includedTags,
          contentRating,
          title: debouncedQuery,
          limit: 100,
        }}
      />
    </ScrollView>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <CloseCurrentScreenHeader
        title={tags.map(tag => preferredTitle(tag.attributes.name)).join(', ')}
      />
      <View
        style={{
          display: 'none',
          height: 65,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Button
          icon={addingMoreTags ? 'check' : 'plus'}
          onPress={() => setAddingMoreTags(x => !x)}>
          {addingMoreTags ? 'Confirm' : 'Add...'}
        </Button>
        <CategoriesCollectionSection
          data={tags}
          renderItem={item => (
            <Chip selected key={item.id}>
              {preferredTitle(item.attributes.name)}
            </Chip>
          )}
        />
      </View>
      {bodyMarkup}
    </SafeAreaView>
  );
}
