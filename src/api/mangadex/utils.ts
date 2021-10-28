import {BackgroundColor} from 'src/components/colors';
import {
  Chapter,
  ContentRating,
  CoverArt,
  Manga,
  PossibleRelationship,
  PossibleRelationshipTypes,
  ReadingStatus,
  Relationship,
  Title,
} from './types';

export enum CoverSize {
  Original = '',
  Medium = '.512.jpg',
  Small = '.256.jpg',
}

export function preferredMangaTitle(manga: Manga) {
  return (
    manga.attributes.title[manga.attributes.originalLanguage] ||
    preferredTitle(manga.attributes.title)
  );
}

export function preferredTitle(title: Title) {
  return title.en || Object.entries(title).map(([_, value]) => value)[0];
}

export function preferredMangaDescription(manga: Manga) {
  if (Object.entries(manga.attributes.description).length === 0) {
    return null;
  }

  return (
    manga.attributes.description[manga.attributes.originalLanguage] ||
    manga.attributes.description.en
  );
}

export function anyValidRelationship(
  resource: {relationships: Relationship[]},
  type: unknown,
): type is PossibleRelationshipTypes {
  return Boolean(resource.relationships.find(r => r.type === type));
}

export function findRelationship<T extends PossibleRelationship>(
  resource: {
    relationships: Relationship[];
  },
  type: PossibleRelationshipTypes,
) {
  if (anyValidRelationship(resource, type)) {
    return resource.relationships.find(r => r.type === type) as T;
  }
  return null;
}

export function findRelationships<T extends PossibleRelationship>(
  resource: {
    relationships: Relationship[];
  },
  type: PossibleRelationshipTypes,
) {
  if (anyValidRelationship(resource, type)) {
    return resource.relationships.filter(r => r.type === type) as T[];
  }
  return [];
}

export function mangaImage(manga: Manga, options?: {size?: CoverSize}): string {
  const cover = findRelationship<CoverArt>(manga, 'cover_art');

  if (!cover?.attributes) {
    return 'https://mangadex.org/avatar.png';
  }
  return coverImage(cover, manga.id, options);
}

export function coverImage(
  cover: CoverArt,
  mangaId: string,
  options?: {size?: CoverSize},
): string {
  const {fileName} = cover.attributes;

  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}${
    options?.size || CoverSize.Medium
  }`;
}

export function chapterImage(chapter: Chapter): string | null {
  const {dataSaver, hash: chapterHash} = chapter.attributes;
  if (dataSaver.length === 0) {
    return 'https://mangadex.org/avatar.png';
  }
  const filename = dataSaver[0];

  return [
    'https://uploads.mangadex.org',
    'data-saver',
    chapterHash,
    filename,
  ].join('/');
}

export function contentRatingBackgroundColor(
  contentRating: ContentRating,
): BackgroundColor {
  switch (contentRating) {
    case ContentRating.safe:
      return 'error';
    case ContentRating.suggestive:
      return 'disabled';
    case ContentRating.erotica:
      return 'accent';
    case ContentRating.pornographic:
      return 'error';
  }
}

export function contentRatingInfo(contentRating: ContentRating): {
  content: string;
  background: BackgroundColor;
  icon: string;
} {
  switch (contentRating) {
    case ContentRating.safe:
      return {
        content: 'For everyone',
        background: 'accent',
        icon: 'check-outline',
      };
    case ContentRating.suggestive:
      return {
        content: 'For everyone (13+)',
        background: 'disabled',
        icon: 'check',
      };
    case ContentRating.erotica:
      return {
        content: 'Erotica (15+)',
        background: 'accent',
        icon: 'alert-outline',
      };
    case ContentRating.pornographic:
      return {content: 'Hentai (18+)', background: 'error', icon: 'alert'};
  }
}

export function readingStatusInfo(readingStatus: ReadingStatus): {
  content: string;
} {
  switch (readingStatus) {
    case ReadingStatus.Completed:
      return {content: 'Completed'};
    case ReadingStatus.Dropped:
      return {content: 'Dropped'};
    case ReadingStatus.OnHold:
      return {content: 'On Hold'};
    case ReadingStatus.PlanToRead:
      return {content: 'Plan to read'};
    case ReadingStatus.ReReading:
      return {content: 'Re-reading'};
    case ReadingStatus.Reading:
      return {content: 'Reading'};
  }
}
