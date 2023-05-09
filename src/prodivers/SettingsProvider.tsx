import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ContentRating,
  MangadexSettings,
  MangadexSettingsUserPreferences,
  MangadexTheme,
  MangaRequestParams,
  SettingsResponse,
} from 'src/api/mangadex/types';
import {useSession} from '.';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useIntl} from 'react-intl';
import {
  useAuthenticatedLazyGetRequest,
  useAuthenticatedPostRequest,
} from 'src/api/utils';
import UrlBuilder from 'src/api/mangadex/types/api/url_builder';
import {toMangadexStringDate} from 'src/utils';

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
  defaultMangaTitleLocale: string;
  dataSaver: boolean;
  spicyMode: boolean;
  readingDirection: ReadingDirection;
  lightTheme: boolean;
  mangaScreenDisplay: MangaScreenDisplay;
  continue: ContinueSettings;
  blurPornographicEntries: boolean;
  volumeSortOrder: 'asc' | 'desc';
  chaptersSortOrder: 'asc' | 'desc';
}

interface SettingsContextState {
  settings: Settings;
  mangadexSettings: MangadexSettings;
  loading: boolean;
  defaultSettings: Settings;
  defaultMangadexSettings: MangadexSettings;
  setSettings(settings: Partial<Settings>): void;
  resetSettings(): void;
  overrideSettings(settings: Settings): void;
  overrideMangadexSetting(mangadexSettings: MangadexSettings): void;
  updateSetting<Key extends keyof Settings, Value extends Settings[Key]>(
    a: Key,
    b: Value,
  ): void;
  updateUserPreferences<
    Key extends keyof MangadexSettingsUserPreferences,
    Value extends MangadexSettingsUserPreferences[Key],
  >(
    a: Key,
    b: Value,
  ): void;
  updateContentRatings(contentRatings: ContentRating[]): void;
}

const defaultSettings: Settings = {
  chapterLanguages: [],
  mangaLanguages: [],
  readingDirection: ReadingDirection.TtB,
  contentRatings: [ContentRating.safe, ContentRating.suggestive],
  dataSaver: true,
  spicyMode: false,
  lightTheme: false,
  mangaScreenDisplay: MangaScreenDisplay.PerVolume,
  continue: {},
  blurPornographicEntries: true,
  volumeSortOrder: 'asc',
  chaptersSortOrder: 'asc',
  defaultMangaTitleLocale: 'en',
};

const defaultMangadexSettings: MangadexSettings = {
  metadata: {version: 1},
  preferedLayout: {
    ambient: false,
    bottomNavPadding: 0,
    feedStyle: 1,
    listStyle: 1,
    listStyleNoArt: 1,
    oneLine: false,
  },
  userPreferences: {
    dataSaver: false,
    filteredLanguages: [],
    groupBlacklist: [],
    interfaceLocale: 'en',
    listMultiplier: 3,
    locale: 'en',
    mdahPort443: false,
    originLanguages: [],
    paginationCount: 32,
    showErotic: false,
    showHentai: false,
    showSafe: true,
    showSuggestive: true,
    theme: MangadexTheme.System,
    userBlacklist: [],
  },
};

export const SettingsContext = React.createContext<SettingsContextState>({
  settings: defaultSettings,
  mangadexSettings: defaultMangadexSettings,
  defaultSettings,
  defaultMangadexSettings,
  loading: false,

  // TODO: not the ugly dummy function pattern (eyes roll emoji)
  setSettings: () => console.log('setSettings: {NOOP}'),
  resetSettings: () => console.log('resetSettings: {NOOP}'),
  overrideSettings: () => console.log('overrideSettings: {NOOP}'),
  overrideMangadexSetting: () => console.log('overrideMangadexSetting: {NOOP}'),
  updateSetting: () => console.log('updateSetting: {NOOP}'),
  updateUserPreferences: () => console.log('updateUserPreferences: {NOOP}'),
  updateContentRatings: () => console.log('updateContentRatings: {NOOP}'),
});

export default function SettingsProvider({children}: PropsWithChildren<{}>) {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const shouldUpdateSettingsToCloud = useRef(false);

  const [userPreferences, setUserPreferences] =
    useState<MangadexSettingsUserPreferences>(
      defaultMangadexSettings.userPreferences,
    );

  const [mangadexSettings, setMangadexSettings] = useState<MangadexSettings>(
    defaultMangadexSettings,
  );

  const [fetchMangadexSettings] =
    useAuthenticatedLazyGetRequest<SettingsResponse>(UrlBuilder.settings());

  const [updateMangadexSettings] = useAuthenticatedPostRequest<{
    settings: MangadexSettings;
  }>(UrlBuilder.settings());

  const handleSettings = (settings: Partial<Settings>) => {
    setSettings(current => ({...current, settings}));
  };

  const handleOverrideMangadexSetting = (
    newMangadexSettings: MangadexSettings,
  ) => {
    shouldUpdateSettingsToCloud.current = true;
    setMangadexSettings(newMangadexSettings);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    shouldUpdateSettingsToCloud.current = true;
    setMangadexSettings(defaultMangadexSettings);
  };

  function updateSetting<
    Key extends keyof Settings,
    Value extends Settings[Key],
  >(key: Key, value: Value) {
    setSettings(current => {
      return {...current, [key]: value};
    });
  }

  function updateUserPreferences<
    Key extends keyof MangadexSettingsUserPreferences,
    Value extends MangadexSettingsUserPreferences[Key],
  >(key: Key, value: Value) {
    shouldUpdateSettingsToCloud.current = true;
    setUserPreferences(current => {
      return {...current, [key]: value};
    });
  }

  function updateContentRatings(contentRatings: ContentRating[]) {
    const showSafe = contentRatings.includes(ContentRating.safe);
    const showSuggestive = contentRatings.includes(ContentRating.suggestive);
    const showErotic = contentRatings.includes(ContentRating.erotica);
    const showHentai = contentRatings.includes(ContentRating.pornographic);

    shouldUpdateSettingsToCloud.current = true;
    setUserPreferences(current => ({
      ...current,
      showSafe,
      showSuggestive,
      showErotic,
      showHentai,
    }));
  }

  useEffect(() => {
    retrieveStoredSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setMangadexSettings(current => ({...current, userPreferences}));
  }, [userPreferences]);

  useEffect(() => {
    if (shouldUpdateSettingsToCloud.current) {
      console.log('Updating settings TO THE CLOUDDDD', mangadexSettings);
      updateMangadexSettings(undefined, {
        settings: mangadexSettings,
        updatedAt: toMangadexStringDate(new Date()),
      })
        .then(response => {
          if (response?.settings) {
            console.log('Settings successfully updated on Mangadex.');
            console.log(response);
            shouldUpdateSettingsToCloud.current = false;
          } else {
            console.warn(response);
          }
        })
        .catch(console.error);
    }
  }, [mangadexSettings]);

  useEffect(() => {
    if (session) {
      fetchMangadexSettings().then(response => {
        if (response?.result === 'ok') {
          setMangadexSettings(response.settings);
        }
      });
    } else {
      setMangadexSettings(defaultMangadexSettings);
    }
  }, [session]);

  useEffect(() => {
    storeSettings(settings);
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        mangadexSettings,
        loading,
        defaultSettings,
        defaultMangadexSettings,
        setSettings: handleSettings,
        overrideSettings: setSettings,
        overrideMangadexSetting: handleOverrideMangadexSetting,
        updateSetting,
        resetSettings,
        updateUserPreferences,
        updateContentRatings,
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
    return settings;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}

export function useSettings() {
  return useSettingsContext().settings;
}

export function useMangadexSettings() {
  return useSettingsContext().mangadexSettings;
}

export function useGlobalMangaParams(): Pick<
  MangaRequestParams,
  'availableTranslatedLanguage' | 'contentRating'
> {
  const {mangaLanguages, contentRatings} = useSettings();

  return {
    availableTranslatedLanguage: mangaLanguages,
    contentRating: contentRatings,
  };
}

export function useContentRatingFitlers() {
  const {
    userPreferences: {showErotic, showHentai, showSafe, showSuggestive},
  } = useMangadexSettings();
  const session = useSession();

  return useMemo(() => {
    let results: ContentRating[] = [];
    if (showSafe) {
      results.push(ContentRating.safe);
    }
    if (showSuggestive) {
      results.push(ContentRating.suggestive);
    }
    if (showErotic) {
      results.push(ContentRating.erotica);
    }
    if (session && showHentai) {
      results.push(ContentRating.pornographic);
    }
    return results;
  }, [showErotic, showHentai, showSafe, showSuggestive, session]);
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

export const possibleSettingsLocales = [
  'ar',
  'bg',
  'bn',
  'ca',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'es',
  'es-la',
  'fa',
  'fi',
  'fr',
  'he',
  'hi',
  'hu',
  'id',
  'it',
  'ja',
  'ko',
  'lt',
  'mn',
  'ms',
  'my',
  'ne',
  'nl',
  'no',
  'pl',
  'pt',
  'pt-br',
  'ro',
  'ru',
  'sr',
  'sv',
  'th',
  'tl',
  'tr',
  'uk',
  'vi',
  'zh',
  'zh-hk',
];

export function usePossibleSettingsLanguages() {
  return useLanguages(possibleSettingsLocales);
}

export function useLanguages(locales: string[]) {
  const intl = useIntl();
  return locales.map(locale => ({
    value: locale,
    name: intl.formatDisplayName(locale, {type: 'language'}) || locale,
  }));
}

// export const possibleSettingsLanguages = [
//   {value: 'ar', name: 'Arabic'},
//   {value: 'bg', name: ''},
//   {value: 'bn', name: ''},
//   {value: 'ca', name: 'Catalan'},
//   {value: 'cs', name: 'Czech'},
//   {value: 'da', name: 'Danish'},
//   {value: 'de', name: 'Deutch'},
//   {value: 'el', name: ''},
//   {value: 'en', name: ''},
//   {value: 'es', name: 'Spanish (Spain)'},
//   {value: 'es-la', name: 'Spanish (Latin Am.)'},
//   {value: 'fa', name: ''},
//   {value: 'fi', name: ''},
//   {value: 'fr', name: 'French'},
//   {value: 'he', name: ''},
//   {value: 'hi', name: ''},
//   {value: 'hu', name: ''},
//   {value: 'id', name: ''},
//   {value: 'it', name: 'Italian'},
//   {value: 'ja', name: 'Japanese'},
//   {value: 'ko', name: 'Korean'},
//   {value: 'lt', name: ''},
//   {value: 'mn', name: ''},
//   {value: 'ms', name: ''},
//   {value: 'my', name: ''},
//   {value: 'ne', name: ''},
//   {value: 'nl', name: ''},
//   {value: 'no', name: ''},
//   {value: 'pl', name: ''},
//   {value: 'pt', name: 'Portugese'},
//   {value: 'pt-br', name: 'Portugese (Brazil)'},
//   {value: 'ro', name: ''},
//   {value: 'ru', name: ''},
//   {value: 'sr', name: ''},
//   {value: 'sv', name: ''},
//   {value: 'th', name: ''},
//   {value: 'tl', name: ''},
//   {value: 'tr', name: ''},
//   {value: 'uk', name: 'Ukrainian'},
//   {value: 'vi', name: 'Vietnamese'},
//   {value: 'zh', name: 'Chinese'},
//   {value: 'zh-hk', name: 'Chinese (trad.)'},
// ];
