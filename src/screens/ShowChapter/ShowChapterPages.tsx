import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Caption,
  IconButton,
  Subheading,
  Text,
} from 'react-native-paper';
import {findRelationship, preferredMangaTitle} from 'src/api';
import {Chapter, Manga} from 'src/api/mangadex/types';
import {useDexifyNavigation} from 'src/foundation/Navigation';
import ShowChapterPagesHeader from './ShowChapterPagesHeader';

interface Page {
  number: number;
  originalImageUrl: string;
  dataSaverImageUrl: string;
}

interface Props {
  pages: Page[];
  chapter: Chapter;
}

export default function ShowChapterPages({pages, chapter}: Props) {
  const navigation = useDexifyNavigation();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(pages[0]);
  const [fullWidth, setFullWidth] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  const isDarkTheme = useColorScheme() === 'dark';

  const width = Dimensions.get('screen').width;
  const manga = findRelationship<Manga>(chapter, 'manga');

  const headerCaptionContents = [
    chapter.attributes.volume
      ? `Volume ${chapter.attributes.volume}`
      : undefined,
    chapter.attributes.chapter
      ? `Chapter ${chapter.attributes.chapter}`
      : undefined,
  ]
    .filter(content => Boolean(content))
    .join(' - ');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHeader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{flex: 1}}>
      <ShowChapterPagesHeader
        title={`Page ${currentPage.number}/${pages.length}`}
        subtitle={headerCaptionContents}
        onPress={navigation.goBack}
        style={{
          display: showHeader ? 'flex' : 'none',
        }}
      />
      <View style={{flex: 1}}>
        {pages.map((page, index) => {
          return (
            <TouchableWithoutFeedback
              key={page.number}
              onPress={({nativeEvent}) => {
                setShowHeader(!showHeader);
                // const isFirstPage = page.number === 1;
                // const isLastPage = page.number === pages.length;
                // const isGoingLeft = nativeEvent.locationX < width / 2;
                // console.log({
                //   isFirstPage,
                //   isLastPage,
                //   isGoingLeft,
                // });
                // if (isGoingLeft && !isFirstPage) {
                //   setCurrentPage(pages[index - 1]);
                // }
                // if (!isGoingLeft && !isLastPage) {
                //   setCurrentPage(pages[page.number]);
                // }
              }}>
              <View
                style={{
                  display: page.number === currentPage.number ? 'flex' : 'none',
                }}>
                <Image
                  onLoadStart={() => setLoading(true)}
                  onLoadEnd={() => setLoading(false)}
                  style={{
                    width: fullWidth ? '100%' : width,
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                  source={{uri: page.dataSaverImageUrl}}
                />
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
}
