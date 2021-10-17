import React, {useState} from 'react';
import {Image, ScrollView, TouchableNativeFeedback, View} from 'react-native';
import {Chip, List, Title, TouchableRipple} from 'react-native-paper';
import {CoverSize, mangaImage} from 'src/api';
import {
  Chapter,
  Manga,
  PagedResultsList,
  SuccessEntityResponse,
} from 'src/api/mangadex/types';
import {useGetRequest} from 'src/api/utils';
import {useHeader} from 'src/prodivers';

interface Props {
  mangaData: SuccessEntityResponse<Manga>;
}

export default function ShowMangaDetails({mangaData}: Props) {
  const manga = mangaData.data;
  const title = Object.entries(manga.attributes.title)[0][1];
  useHeader({title});

  const [showFullImage, setShowFullImage] = useState(false);
  const aspectRatio = showFullImage ? 1 : 2;

  const {data, loading} = useGetRequest<PagedResultsList<Chapter>>(
    `https://api.mangadex.org/manga/${manga.id}/feed?translatedLanguage[]=en`,
  );

  const chapters: {[key: string]: Chapter[]} = {};
  if (data?.result === 'ok') {
    for (const chapter of data.data) {
      const key = chapter.attributes.chapter || 'N/A';
      if (chapters[key]) {
        chapters[key].push(chapter);
      } else {
        chapters[key] = [chapter];
      }
    }
  }

  return (
    <View>
      <TouchableNativeFeedback
        useForeground
        onPress={() => setShowFullImage(!showFullImage)}
        background={TouchableNativeFeedback.Ripple('#fff', false)}>
        <View>
          <Image
            source={{uri: mangaImage(manga, {size: CoverSize.Original})}}
            style={{width: '100%', aspectRatio}}
          />
        </View>
      </TouchableNativeFeedback>
      <ScrollView>
        <View>
          <View>
            <List.Section
              title={`Chapters (${
                (data?.result === 'ok' && data.total) || '...'
              })`}>
              {Object.entries(chapters).map(([chapterNumber, chaptersList]) => (
                <List.Accordion
                  key={String(chapterNumber)}
                  title={`Chapter ${chapterNumber}`}
                  left={props => <List.Icon {...props} icon="folder" />}>
                  {chaptersList.map(chapter => (
                    <List.Item
                      key={chapter.id}
                      title={chapter.attributes.translatedLanguage}
                    />
                  ))}
                </List.Accordion>
              ))}
            </List.Section>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
