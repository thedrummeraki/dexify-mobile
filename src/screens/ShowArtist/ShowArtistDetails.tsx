import React, {useState} from 'react';
import {Image, Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, IconButton, TextInput, Title} from 'react-native-paper';
import {Artist, Author, ContentRating} from 'src/api/mangadex/types';
import {CloseCurrentScreenHeader, MangaSearchCollection} from 'src/components';
import {useShowArtistRoute} from 'src/foundation';
import {useContentRatingFitlers} from 'src/prodivers';

interface Props {
  author: Author | Artist;
}

export default function ShowArtistDetails({author}: Props) {
  const {
    params: {allowHentai},
  } = useShowArtistRoute();
  const {
    attributes: {website, twitter, pixiv, nicoVideo, youtube},
  } = author;

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
        <Title style={{marginTop: 15}}>{author.attributes.name}</Title>
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
          {pixiv && (
            <IconButton
              icon="image"
              onPress={() => pixiv && Linking.openURL(pixiv)}
            />
          )}
          {nicoVideo && (
            <IconButton
              icon="video"
              onPress={() => nicoVideo && Linking.openURL(nicoVideo)}
            />
          )}
          {youtube && (
            <IconButton
              icon="youtube"
              onPress={() => youtube && Linking.openURL(youtube)}
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
          artists: [author.id],
          limit: 100,
          contentRating,
          order: {followedCount: 'desc'},
        }}
      />
    </ScrollView>
  );
}
