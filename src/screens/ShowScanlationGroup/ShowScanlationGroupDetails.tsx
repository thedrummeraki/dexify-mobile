import React, {useState} from 'react';
import {Image, Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, IconButton, TextInput, Title} from 'react-native-paper';
import {ScanlationGroup, ContentRating} from 'src/api/mangadex/types';
import {CloseCurrentScreenHeader, MangaSearchCollection} from 'src/components';
import {useShowScanlationGroupRoute} from 'src/foundation';
import {useContentRatingFitlers} from 'src/prodivers';

interface Props {
  scanlationGroup: ScanlationGroup;
}

export default function ShowScanlationGroupDetails({scanlationGroup}: Props) {
  const {
    params: {allowHentai},
  } = useShowScanlationGroupRoute();
  const {
    attributes: {name, description, official, website, twitter},
  } = scanlationGroup;

  const [searchMangaInput, setSearchMangaInput] = useState('');

  const contentRating = useContentRatingFitlers();

  if (allowHentai && !contentRating.includes(ContentRating.pornographic)) {
    contentRating.push(ContentRating.pornographic);
  }

  const imageMarkup = (
    <Image
      source={{uri: 'https://mangadex.org/img/avatar.png'}}
      style={{width: 200, height: 200, borderRadius: 200}}
    />
  );

  return (
    <ScrollView style={{flex: 1}}>
      <CloseCurrentScreenHeader />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        {imageMarkup}
      </View>
      <View style={{marginHorizontal: 15, marginBottom: 20}}>
        <Title style={{marginTop: 15}}>{name}</Title>
        <View
          style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
          <Button
            compact
            disabled={!website}
            mode="contained"
            icon="web"
            onPress={() => website && Linking.openURL(website)}>
            Website
          </Button>
          {twitter && (
            <IconButton
              icon="twitter"
              onPress={() => twitter && Linking.openURL(twitter)}
            />
          )}
        </View>
      </View>

      <TextInput
        dense
        placeholder="Search for manga..."
        value={searchMangaInput}
        onChangeText={setSearchMangaInput}
        style={{marginHorizontal: 15, marginBottom: 5, display: 'none'}}
      />
      <MangaSearchCollection
        options={{
          group: scanlationGroup.id,
          limit: 100,
          contentRating: contentRating,
          order: {followedCount: 'desc'},
        }}
      />
    </ScrollView>
  );
}
