import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Image, TouchableWithoutFeedback, View} from 'react-native';
import {Chapter, Manga} from 'src/api/mangadex/types';
import {useDexifyNavigation} from 'src/foundation/Navigation';
import ShowChapterPagesHeader from './ShowChapterPagesHeader';

import SwipeableViews from 'react-swipeable-views-native';
import FullScreenImageSwiper from '../ShowMangaGallery/FullScreenImageSwiper';
import {useSettings} from 'src/prodivers';

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
  const {dataSaver} = useSettings();

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(pages[0]);
  const [fullWidth, setFullWidth] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [readyToHideHeader, setReadyToHideHeader] = useState(false);
  const hasHiddenHeaderOnFirstRender = useRef(false);

  const width = Dimensions.get('screen').width;

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
    if (!loading) {
      setReadyToHideHeader(true);
    }
  }, [loading]);

  useEffect(() => {
    if (!readyToHideHeader || hasHiddenHeaderOnFirstRender.current) {
      return;
    }

    const timer = setTimeout(() => {
      setShowHeader(false);
      // not sure if this will beed needed but adding in case
      hasHiddenHeaderOnFirstRender.current = true;
    }, 2000);

    return () => clearTimeout(timer);
  }, [readyToHideHeader]);

  return (
    <View style={{flex: 1}}>
      <ShowChapterPagesHeader
        title={`Page ${currentPage.number}/${pages.length}`}
        subtitle={headerCaptionContents}
        onPress={navigation.goBack}
        hidden={!showHeader}
      />
      {/* <FullScreenImageSwiper
        initialPage={0}
        images={pages.map(page => ({uri: page.originalImageUrl}))}
        onPageSelected={console.log}
      /> */}
      <SwipeableViews
        style={{flex: 1}}
        onChangeIndex={index => {
          setCurrentPage(pages[index]);
        }}>
        {pages.map(page => {
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
              <View>
                <Image
                  onLoadEnd={() => setLoading(false)}
                  style={{
                    width: fullWidth ? '100%' : width,
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                  source={{
                    uri: dataSaver
                      ? page.dataSaverImageUrl
                      : page.originalImageUrl,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </SwipeableViews>
    </View>
  );
}
