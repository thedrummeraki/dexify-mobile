import React, { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Modal, Portal, Provider, Text, Title } from "react-native-paper";
import { mangaImage } from "src/api";
import { Manga } from "src/api/mangadex/types";
import BasicList from "src/components/BasicList";
import Thumbnail from "src/foundation/Thumbnail";
import { useLibraryContext } from "src/prodivers";

interface MangaInList {
  title: string;
  id: string;
  mangaCount: number;
  manga: Manga[];
  mangaId?: string;
}

interface Props {
  mangaInList: MangaInList[];
}

export default function LibraryDetails({mangaInList}: Props) {
  const {createCustomList, refreshCustomLists} = useLibraryContext();

  return (
    <ScrollView style={{flex: 1, paddingVertical: 5}}>
      <View style={{padding: 5}}>
        <Title>Your library</Title>
        <Button mode='contained' onPress={() => {}}>Create new list</Button>
      </View>
      <BasicList
        data={mangaInList}
        aspectRatio={1/2}
        renderItem={item => {
          const imageUrl = item.manga.length < 1 ? 'https://mangadex.org/avatar.png' : item.manga.map((manga) => mangaImage(manga));
          return (
          <Thumbnail
            imageUrl={imageUrl}
            width='100%'
            aspectRatio={1}
            title={item.title}
            onPress={() => console.log('hhhelllo>?>>>>>>>????')}
          />
        )}}
      />
    </ScrollView>
  )
}
