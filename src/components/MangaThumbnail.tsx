import React, {useCallback} from 'react';
import {coverImage, CoverSize, mangaImage, preferredMangaTitle} from 'src/api';
import {ContentRating, Manga} from 'src/api/mangadex/types';
import {useDexifyNavigation} from 'src/foundation';
import Thumbnail, {ThumbnailBadge} from 'src/foundation/Thumbnail';

interface Props {
  manga: Manga;
  hideTitle?: boolean;
  clickable?: boolean;
  coverSize?: CoverSize;
  onPress?(): void;
}

export default function MangaThumbnail({
  manga,
  hideTitle,
  clickable = true,
  coverSize = CoverSize.Small,
  onPress,
}: Props) {
  const navigation = useDexifyNavigation();
  const handlePress = () => {
    navigation.navigate('ShowManga', {id: manga.id});
  };
  const isHentai =
    manga.attributes.contentRating === ContentRating.pornographic;

  return (
    <Thumbnail
      TopComponent={
        (isHentai && <ThumbnailBadge>18+</ThumbnailBadge>) || undefined
      }
      hideTitle={hideTitle}
      imageUrl={mangaImage(manga, {size: coverSize}) || '/'}
      title={preferredMangaTitle(manga)}
      width="100%"
      aspectRatio={0.8}
      onPress={onPress || clickable ? handlePress : undefined}
    />
  );
}
