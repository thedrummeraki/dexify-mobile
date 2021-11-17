import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Title } from "react-native-paper";
import BasicList from "src/components/BasicList";
import Thumbnail, { ThumbnailBadge } from "src/foundation/Thumbnail";
import { pluralize } from "src/utils";

interface MangaByStatus {
  mangaIds: string[];
}

interface MangaInList {
  title: string;
  id: string;
  mangaCount: number;
  mangaId?: string;
}

interface Props {
  mangaInList: MangaInList[];
}

export default function LibraryDetails({mangaInList}: Props) {
  return (
    <ScrollView style={{flex: 1, paddingVertical: 5}}>
      <Title style={{padding: 5}}>Your library</Title>
      <BasicList
        data={mangaInList}
        aspectRatio={1/2}
        renderItem={item => (
          <Thumbnail
            TopComponent={<ThumbnailBadge>{pluralize(item.mangaCount, 'title')}</ThumbnailBadge>}
            imageUrl='https://mangadex.org/avatar.png'
            width='100%'
            aspectRatio={1}
            title={item.title}
          />
        )}
      />
    </ScrollView>
  )
}
