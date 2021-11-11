import React, {useCallback} from 'react';
import {View} from 'react-native';
import {coverImage, CoverSize, mangaImage, preferredMangaTitle} from 'src/api';
import {ContentRating, Manga} from 'src/api/mangadex/types';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail, {
  ThumbnailBadge,
  ThumbnailDimensionsProps,
} from 'src/foundation/Thumbnail';
import {useLibraryStatus} from 'src/prodivers';

interface Props {
  manga: Manga;
  showReadingStatus?: boolean;
  hideTitle?: boolean;
  clickable?: boolean;
  coverSize?: CoverSize;
  onPress?(): void;
}

export default function MangaThumbnail({
  manga,
  showReadingStatus,
  hideTitle,
  clickable = true,
  coverSize = CoverSize.Small,
  width,
  height,
  aspectRatio,
  onPress,
}: Props & Partial<ThumbnailDimensionsProps>) {
  const navigation = useDexifyNavigation();
  const handlePress = useCallback(() => {
    navigation.push('ShowManga', {id: manga.id});
  }, [manga.id]);
  const readingStatus = useLibraryStatus(manga);
  const isHentai =
    manga.attributes.contentRating === ContentRating.pornographic;

  const hentaiBadgeMarkup = isHentai ? (
    <ThumbnailBadge>18+</ThumbnailBadge>
  ) : null;
  const readingStatusMarkup =
    showReadingStatus && readingStatus !== null ? (
      <ThumbnailBadge>{readingStatus}</ThumbnailBadge>
    ) : null;

  return (
    <Thumbnail
      TopComponent={
        <View>
          {hentaiBadgeMarkup}
          {readingStatusMarkup}
        </View>
      }
      hideTitle={hideTitle}
      imageUrl={mangaImage(manga, {size: coverSize}) || '/'}
      title={preferredMangaTitle(manga)}
      width={width || '100%'}
      height={height}
      aspectRatio={aspectRatio || 0.8}
      onPress={onPress || clickable ? handlePress : undefined}
    />
  );
}
