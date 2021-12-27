import React from "react";
import { View } from "react-native";
import { ActivityIndicator, IconButton, Text } from "react-native-paper";
import { Chapter, PagedResultsList } from "src/api/mangadex/types";
import UrlBuilder from "src/api/mangadex/types/api/url_builder";
import { useGetRequest } from "src/api/utils";
import { CloseCurrentScreenHeader } from "src/components";
import BasicList from "src/components/BasicList";
import { useContentRatingFitlers } from "src/prodivers";
import { VolumeInfo } from "../../../ShowMangaDetails";
import { ChapterItem } from "../ChaptersList";

interface Props {
  volumeInfo: VolumeInfo;
  onPreviousVolume(): void;
  onNextVolume(): void;
  onCancel(): void;
}

export default function VolumeDetails({volumeInfo, onCancel}: Props) {
  const {volume, chapterIds: ids} = volumeInfo;

  const contentRating = useContentRatingFitlers();
  const {data, loading, error} = useGetRequest<PagedResultsList<Chapter>>(
    UrlBuilder.chaptersList({
      ids,
      contentRating,
    }),
    {
      refreshSession: false,
      forceRefresh: false
    }
  );

  const title = volume === 'null' || volume === null ? 'No volume' : `Volume ${volume}`;

  if (loading) {
    return <View>
      <CloseCurrentScreenHeader onClose={onCancel} title={title} icon='arrow-left' />
      <ActivityIndicator style={{flex: 1}} />
    </View>;
  }

  if (error || data?.result === 'error') {
    console.error(error || data?.result === 'error' && data.errors || 'unknown error');
    return <Text>Uh oh that didn't work!</Text>
  }

  if (data) {
    return <View>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <CloseCurrentScreenHeader onClose={onCancel} title={title} icon='arrow-left' />
        <IconButton icon='dots-vertical' onPress={() => {}} />
      </View>
      <BasicList
        data={data.data} 
        aspectRatio={1}
        renderItem={chapter => <ChapterItem chapter={chapter} />}
        itemStyle={{padding: 0}} />
    </View>
  }

  return null;
}
