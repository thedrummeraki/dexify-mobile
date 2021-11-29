import React from 'react';
import {Dimensions, TouchableNativeFeedback, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Title, Caption, Text, Button} from 'react-native-paper';
import {
  mangaImage,
  CoverSize,
  preferredMangaTitle,
  preferredTitle,
  preferredMangaDescription,
  readingStatusInfo,
} from 'src/api';
import {Manga} from 'src/api/mangadex/types';
import {ImageGradient, TextBadge} from 'src/components';
import {useDexifyNavigation} from 'src/foundation';
import {useLibraryStatus} from 'src/prodivers';
import {useMangaDetails} from 'src/screens/ShowManga/ShowMangaDetails/ShowMangaDetails';

interface Props {
  manga: Manga;
  aspectRatio?: number;
  showReadingStatus?: boolean;
  navigateToManga?: boolean;
  description?: string | null;
  descriptionNumberOfLines?: number;
  primaryAction?: {content: string; onPress(): void};
  FooterComponent?: React.ReactElement;
}

export default function TopManga({
  manga,
  showReadingStatus,
  aspectRatio = 1.2,
  navigateToManga,
  description,
  descriptionNumberOfLines = 2,
  primaryAction,
  FooterComponent,
}: Props) {
  const navigation = useDexifyNavigation();

  const libraryStatus = useLibraryStatus(manga);
  const {
    content: readingStatus,
    defaultValue,
    background,
    icon: readingStatusIcon,
  } = readingStatusInfo(libraryStatus);

  const {coverUrl} = useMangaDetails();

  const primaryActionWidth = Dimensions.get('window').width / 2;
  const goToManga = () => navigation.push('ShowManga', manga);

  return (
    <View>
      <TouchableNativeFeedback
        onPress={navigateToManga ? goToManga : undefined}>
        <View>
          <ImageGradient aspectRatio={aspectRatio} />
          <FastImage
            source={{
              uri: coverUrl || mangaImage(manga, {size: CoverSize.Original}),
            }}
            style={{width: '100%', aspectRatio}}
            resizeMode="cover"
          />
        </View>
      </TouchableNativeFeedback>
      <View
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          zIndex: 1,
          marginHorizontal: 15,
        }}>
        <Title style={{lineHeight: 22}}>{preferredMangaTitle(manga)}</Title>
        <View style={{flex: 1, flexDirection: 'row'}}>
          {showReadingStatus && !defaultValue ? (
            <TextBadge
              content={readingStatus}
              icon={readingStatusIcon}
              background={background}
            />
          ) : null}
        </View>
        {description ? (
          <Text
            numberOfLines={descriptionNumberOfLines}
            ellipsizeMode="tail"
            style={{fontSize: 12, marginTop: 10}}>
            {description}
          </Text>
        ) : null}

        {FooterComponent}

        {primaryAction ? (
          <Button
            mode="contained"
            style={{
              width: primaryActionWidth,
              marginTop: 15,
              marginBottom: -10,
            }}
            onPress={primaryAction.onPress}>
            {primaryAction.content}
          </Button>
        ) : null}
      </View>
    </View>
  );
}
