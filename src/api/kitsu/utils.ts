import {Kitsu} from '.';

export function friendlyStatus(status: Kitsu.ShowStatus) {
  switch (status) {
    case 'current':
      return 'Airing now';
    case 'finished':
      return 'Finished';
    case 'tba':
      return 'T.B.A.';
    case 'unreleased':
      return 'Unreleased';
    case 'upcoming':
      return 'Coming soon';
  }
}

export function preferredThumbnailImage(posterImage: Kitsu.Image) {
  return (
    posterImage.small ||
    posterImage.tiny ||
    posterImage.medium ||
    posterImage.original
  );
}
