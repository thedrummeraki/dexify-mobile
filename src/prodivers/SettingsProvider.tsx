import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';
import {ContentRating} from 'src/api/mangadex/types';
import {useSession} from '.';
import EncryptedStorage from 'react-native-encrypted-storage';

export enum ReadingDirection {
  LtR,
  RtL,
  TtB,
  BtT,
}

export enum MangaScreenDisplay {
  PerVolume,
  PerChapter,
}

export interface ContinueSettings {
  reading?: {id: string; coverUrl: string; page: number; volume?: string}; // chapter
}

export interface Settings {
  chapterLanguages: string[]; // null means all languages
  mangaLanguages: string[];
  contentRatings: ContentRating[];
  dataSaver: boolean;
  spicyMode: boolean;
  readingDirection: ReadingDirection;
  lightTheme: boolean;
  mangaScreenDisplay: MangaScreenDisplay;
  continue: ContinueSettings;
  volumeSortOrder: 'asc' | 'desc';
}

interface SettingsContextState {
  settings: Settings;
  loading: boolean;
  defaultSettings: Settings;
  setSettings(settings: Partial<Settings>): void;
  resetSettings(): void;
  overrideSettings(settings: Settings): void;
  updateSetting<Key extends keyof Settings, Value extends Settings[Key]>(
    a: Key,
    b: Value,
  ): void;
}

const defaultSettings: Settings = {
  chapterLanguages: [],
  mangaLanguages: [],
  readingDirection: ReadingDirection.TtB,
  contentRatings: [
    ContentRating.safe,
    ContentRating.suggestive,
    ContentRating.erotica,
  ],
  dataSaver: true,
  spicyMode: false,
  lightTheme: false,
  mangaScreenDisplay: MangaScreenDisplay.PerVolume,
  continue: {},
  volumeSortOrder: 'desc',
};

export const SettingsContext = React.createContext<SettingsContextState>({
  settings: defaultSettings,
  defaultSettings,
  loading: false,
  setSettings: () => console.log('setSettings: {NOOP}'),
  resetSettings: () => console.log('resetSettings: {NOOP}'),
  overrideSettings: () => console.log('overrideSettings: {NOOP}'),
  updateSetting: () => console.log('updateSetting: {NOOP}'),
});

export default function SettingsProvider({children}: PropsWithChildren<{}>) {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const handleSettings = (settings: Partial<Settings>) => {
    setSettings(current => ({...current, settings}));
  };

  const resetSettings = () => setSettings(defaultSettings);

  function updateSetting<
    Key extends keyof Settings,
    Value extends Settings[Key],
  >(key: Key, value: Value) {
    setSettings(current => {
      return {...current, [key]: value};
    });
  }

  useEffect(() => {
    retrieveStoredSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    storeSettings(settings);
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings: session ? settings : defaultSettings,
        loading,
        defaultSettings,
        setSettings: handleSettings,
        overrideSettings: setSettings,
        updateSetting,
        resetSettings,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

async function retrieveStoredSettings(): Promise<Settings> {
  try {
    const retrieved = await EncryptedStorage.getItem('user_settings');
    if (retrieved) {
      return JSON.parse(retrieved) as Settings;
    }
    return defaultSettings;
  } catch (error) {
    console.error(error, 'returning default settings instead...');
    return defaultSettings;
  }
}

async function storeSettings(settings: Settings) {
  try {
    await EncryptedStorage.setItem('user_settings', JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}

export function useSettings() {
  return useSettingsContext().settings;
}

export function useContentRatingFitlers() {
  const settings = useSettings();

  return settings.spicyMode
    ? [ContentRating.pornographic]
    : settings.contentRatings;
}

export const possibleSettingsContentRatings = [
  {value: ContentRating.safe, name: 'For everyone (safe)'},
  {value: ContentRating.suggestive, name: 'For 13+ (suggestive)'},
  {value: ContentRating.erotica, name: 'For 15+ (erotica)'},
  {value: ContentRating.pornographic, name: 'For 18+ (hentai/pornographic)'},
];

export const possibleSettingsReadingDirections = [
  {
    value: ReadingDirection.LtR,
    name: 'Left to right',
    icon: 'arrow-right-thin-circle-outline',
  },
  {
    value: ReadingDirection.RtL,
    name: 'Right to left',
    icon: 'arrow-left-thin-circle-outline',
  },
];

export const possibleSettingsLanguages = [
  {value: 'ar', name: 'Arabic'},
  {value: 'bg', name: ''},
  {value: 'bn', name: ''},
  {value: 'ca', name: 'Catalan'},
  {value: 'cs', name: 'Czech'},
  {value: 'da', name: 'Danish'},
  {value: 'de', name: 'Deutch'},
  {value: 'el', name: ''},
  {value: 'en', name: ''},
  {value: 'es', name: 'Spanish (Spain)'},
  {value: 'es-la', name: 'Spanish (Latin Am.)'},
  {value: 'fa', name: ''},
  {value: 'fi', name: ''},
  {value: 'fr', name: 'French'},
  {value: 'he', name: ''},
  {value: 'hi', name: ''},
  {value: 'hu', name: ''},
  {value: 'id', name: ''},
  {value: 'it', name: 'Italian'},
  {value: 'ja', name: 'Japanese'},
  {value: 'ko', name: 'Korean'},
  {value: 'lt', name: ''},
  {value: 'mn', name: ''},
  {value: 'ms', name: ''},
  {value: 'my', name: ''},
  {value: 'ne', name: ''},
  {value: 'nl', name: ''},
  {value: 'no', name: ''},
  {value: 'pl', name: ''},
  {value: 'pt', name: 'Portugese'},
  {value: 'pt-br', name: 'Portugese (Brazil)'},
  {value: 'ro', name: ''},
  {value: 'ru', name: ''},
  {value: 'sr', name: ''},
  {value: 'sv', name: ''},
  {value: 'th', name: ''},
  {value: 'tl', name: ''},
  {value: 'tr', name: ''},
  {value: 'uk', name: 'Ukrainian'},
  {value: 'vi', name: 'Vietnamese'},
  {value: 'zh', name: 'Chinese'},
  {value: 'zh-hk', name: 'Chinese (trad.)'},
];
