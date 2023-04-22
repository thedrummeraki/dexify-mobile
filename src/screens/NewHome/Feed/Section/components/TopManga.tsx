import React from 'react';
import {Dimensions, Image, TouchableNativeFeedback, View} from 'react-native';
import {Title, Text, Button} from 'react-native-paper';
import {
  mangaImage,
  CoverSize,
  preferredMangaTitle,
  readingStatusInfo,
} from 'src/api';
import {Manga} from 'src/api/mangadex/types';
import {
  CloseCurrentScreenHeader,
  ImageGradient,
  TextBadge,
} from 'src/components';
import {useDexifyNavigation} from 'src/foundation';
import {useLibraryStatus} from 'src/prodivers';
import {useMangaDetails} from 'src/screens/ShowManga/ShowMangaDetails/ShowMangaDetails';
import {notEmpty} from 'src/utils';

type BasicDescription = string | null | undefined;
interface ClickableDescription {
  content: Exclude<BasicDescription, null | undefined>;
  onPress(): void;
}

type Description = BasicDescription | ClickableDescription;
export type TopMangaDescription =
  | Description
  | Description[]
  | null
  | undefined;

interface Props {
  manga: Manga;
  aspectRatio?: number;
  showReadingStatus?: boolean;
  navigateToManga?: boolean;
  description?: TopMangaDescription;
  descriptionNumberOfLines?: number;
  primaryAction?: {content: string; onPress(): void};
  FooterComponent?: React.ReactElement;
  allowCloseScreen?: boolean;
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
  allowCloseScreen,
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
          {allowCloseScreen ? (
            <CloseCurrentScreenHeader
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10000,
              }}
            />
          ) : null}
          <ImageGradient aspectRatio={aspectRatio} />
          <Image
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
        <DescriptionMarkup
          description={description}
          descriptionNumberOfLines={descriptionNumberOfLines}
        />

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

function DescriptionMarkup({
  description,
  descriptionNumberOfLines,
}: {
  description: TopMangaDescription;
  descriptionNumberOfLines?: number;
}) {
  if (!description) {
    return null;
  }

  if (Array.isArray(description)) {
    return (
      <Text>
        {description
          .filter(notEmpty)
          .map<React.ReactNode>((description, index) => (
            <DescriptionMarkup
              key={`top-manga-description-${index}`}
              description={description}
            />
          ))
          .reduce((prev, curr) => [prev, ' ・ ', curr])}
      </Text>
    );
  } else if (typeof description === 'string') {
    return (
      <Text
        numberOfLines={descriptionNumberOfLines}
        ellipsizeMode="tail"
        style={{fontSize: 12, marginTop: 5}}>
        {description}
      </Text>
    );
  } else {
    return (
      <Text
        numberOfLines={descriptionNumberOfLines}
        ellipsizeMode="tail"
        style={{fontSize: 12, marginTop: 5}}
        onPress={description.onPress}>
        {description.content}
      </Text>
    );
  }
}
