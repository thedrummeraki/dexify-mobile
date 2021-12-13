import React, {useEffect, useRef, useState} from 'react';
import {Image, View} from 'react-native';
import {Text} from 'react-native-paper';
import {Chapter, Manga} from 'src/api/mangadex/types';
import {useSettings} from 'src/prodivers';
import {useDimensions} from 'src/utils';
import ShowChapterReaderPagesList from './components/ShowChapterReaderPagesList';
import {Page} from './types';

interface Props {
  baseUrl: string;
  chapter: Chapter;
  // manga: Manga;
}

export default function ShowChapterReader({baseUrl, chapter}: Props) {
  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<Page[]>([]);
  const {width: deviceWidth, height: deviceHeight} = useDimensions();
  const {dataSaver} = useSettings();

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    const data = dataSaver
      ? chapter.attributes.dataSaver
      : chapter.attributes.data;
    const {hash} = chapter.attributes;
    const source = dataSaver ? 'data-saver' : 'data';

    data.forEach((filename, index) => {
      const number = index + 1;
      const uri = [baseUrl, source, hash, filename].join('/');

      Image.getSize(
        uri,
        (width, height) => {
          const page: Page = {
            number,
            image: {uri, width, height},
          };
          setPages(current => [...current, page]);
        },
        () => {
          const page: Page = {
            number,
            image: {uri, width: deviceWidth, height: deviceHeight},
          };
          setPages(current => [...current, page]);
        },
      );
    });
  }, [baseUrl]);

  useEffect(() => {
    const loading = pages.length < chapter.attributes.data.length;
    if (!loading) {
      initialized.current = true;
    }
    setLoading(pages.length < chapter.attributes.data.length);
  }, [pages]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const sortedPages = pages.sort((page, other) =>
    page.number > other.number ? 1 : -1,
  );

  return (
    <View style={{flex: 1}}>
      <ShowChapterReaderPagesList pages={sortedPages} />
    </View>
  );
}
