import React, {useCallback} from 'react';
import {View} from 'react-native';
import {
  CoverSize,
  findRelationship,
  mangaImage,
  preferredMangaTitle,
  readingStatusInfo,
} from 'src/api';
import {Artist, Author, ContentRating, Manga} from 'src/api/mangadex/types';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail, {
  ThumbnailBadge,
  ThumbnailDimensionsProps,
} from 'src/foundation/Thumbnail';
import {useLibraryStatus, useSettings} from 'src/prodivers';
import {useBackgroundColor} from './colors';

interface Props {
  manga: Manga;
  showImageIfHentai?: boolean;
  showReadingStatus?: boolean;
  subtitle?: string;
  hideTitle?: boolean;
  hideAuthor?: boolean;
  clickable?: boolean;
  coverSize?: CoverSize;
  onPress?(): void;
  onLongPress?(): void;
}

export default function MangaThumbnail({
  manga,
  showReadingStatus,
  showImageIfHentai,
  subtitle,
  hideTitle,
  hideAuthor,
  clickable = true,
  coverSize = CoverSize.Small,
  width,
  height,
  aspectRatio,
  onPress,
  onLongPress,
}: Props & Partial<ThumbnailDimensionsProps>) {
  const navigation = useDexifyNavigation();
  const handlePress = useCallback(() => {
    navigation.push('ShowManga', manga);
  }, [manga.id]);
  const readingStatus = useLibraryStatus(manga);
  const isHentai =
    manga.attributes.contentRating === ContentRating.pornographic;

  const {blurPornographicEntries} = useSettings();

  const author =
    findRelationship<Author>(manga, 'author') ||
    findRelationship<Artist>(manga, 'artist');
  const authorPresent = Boolean(author && author.attributes);

  const hentaiBadgeMarkup = isHentai ? (
    <ThumbnailBadge badgeStyle={{backgroundColor: '#f00', fontWeight: 'bold'}}>
      18+
    </ThumbnailBadge>
  ) : null;
  const readingStatusBackgroundColor = useBackgroundColor(
    readingStatusInfo(readingStatus).background,
  );

  const readingStatusMarkup =
    showReadingStatus && readingStatus !== null ? (
      <ThumbnailBadge
        badgeStyle={{backgroundColor: readingStatusBackgroundColor}}>
        {readingStatusInfo(readingStatus).content}
      </ThumbnailBadge>
    ) : null;

  const allowActualImage = true || (isHentai && showImageIfHentai) || !isHentai;
  const imageUrl = allowActualImage
    ? mangaImage(manga, {size: coverSize})
    : 'https://mangadex.org/img/avatar.png';

  return (
    <Thumbnail
      TopComponent={
        <View style={{flex: 1, flexDirection: 'row'}}>
          {hentaiBadgeMarkup}
          {readingStatusMarkup}
        </View>
      }
      hideTitle={hideTitle}
      imageUrl={imageUrl}
      blurRadius={blurPornographicEntries && isHentai ? 25 : undefined}
      title={preferredMangaTitle(manga)}
      subtitle={
        subtitle
          ? subtitle
          : hideAuthor || !authorPresent
          ? undefined
          : author?.attributes.name
      }
      width={width || '100%'}
      height={height}
      aspectRatio={aspectRatio || 0.8}
      onPress={onPress || clickable ? handlePress : undefined}
      onLongPress={onLongPress}
      onSubtitlePress={
        author
          ? () => navigation.navigate('ShowArtist', {id: author.id})
          : undefined
      }
    />
  );
}
