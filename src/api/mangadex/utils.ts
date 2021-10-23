import {
  Author,
  Chapter,
  CoverArt,
  Manga,
  PossibleRelationship,
  PossibleRelationshipTypes,
  Relationship,
  ScanlationGroup,
} from './types';

export enum CoverSize {
  Original = '',
  Medium = '.512.jpg',
  Small = '.256.jpg',
}

export function preferredMangaTitle(manga: Manga) {
  return (
    manga.attributes.title[manga.attributes.originalLanguage] ||
    manga.attributes.title.en ||
    Object.entries(manga.attributes.title).map(([key, value]) => value)[0]
  );
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
  const {fileName} = cover.attributes;

  return `https://uploads.mangadex.org/covers/${manga.id}/${fileName}${
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
