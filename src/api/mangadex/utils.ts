import {Chapter, Manga} from './types';

export enum CoverSize {
  Original = '',
  Medium = '.512.jpg',
  Small = '.256.jpg',
}

export function preferredMangaTitle(manga: Manga) {
  return Object.entries(manga.attributes.title)[0][1];
}

export function mangaImage(manga: Manga, options?: {size?: CoverSize}): string {
  const cover = manga.relationships.find(
    relationship => relationship.type === 'cover_art',
  );

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
