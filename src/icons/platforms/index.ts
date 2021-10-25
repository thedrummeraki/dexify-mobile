import {YourAnime} from 'src/api/youranime';

export const platforms = {
  adultswim: require('./adultswim-icon.png'),
  animelab: require('./animelab-icon.jpg'),
  crunchyroll: require('./crunchyroll-icon2.png'),
  funimation: require('./funimation-icon.png'),
  hidive: require('./hidive-icon.png'),
  hulu: require('./hulu-icon.png'),
  netflix: require('./netflix-icon.jpg'),
  prime: require('./primevideo-icon.jpg'),
  tubi: require('./tubi-icon.png'),
  vimeo: require('./vimeo-icon.jpg'),
  vrv: require('./vrv-icon.png'),
  youtube: require('./youtube-icon.png'),
};

export const platformIcon = (name: PlatformIcons) => platforms[name];

export type PlatformIcons = keyof typeof platforms;
