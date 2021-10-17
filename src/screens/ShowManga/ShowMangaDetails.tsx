import React from 'react';
import {View} from 'react-native';
import {Title} from 'react-native-paper';
import {Manga, SuccessEntityResponse} from 'src/api/mangadex/types';
import {useHeader} from 'src/prodivers';

interface Props {
  mangaData: SuccessEntityResponse<Manga>;
}

export default function ShowMangaDetails({mangaData}: Props) {
  const title = Object.entries(mangaData.data.attributes.title)[0][1];
  useHeader({title});
  return (
    <View>
      <Title>{title}</Title>
    </View>
  );
}
