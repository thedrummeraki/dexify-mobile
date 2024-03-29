import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  FlatList,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  useColorScheme,
  View,
} from 'react-native';
import {
  Button,
  Caption,
  Chip,
  Searchbar,
  Snackbar,
  Switch,
  Text,
  TextInput,
  Title,
  useTheme,
} from 'react-native-paper';
import {usePostRequest} from 'src/api/utils';
import {
  possibleSettingsContentRatings,
  SessionContext,
  Settings,
  usePossibleSettingsLanguages,
  useSettingsContext,
} from 'src/prodivers';
import {useBackgroundColor} from 'src/components/colors';
import CategoriesCollectionSection from 'src/components/CategoriesCollection/CategoriesCollectionSection';
import {
  BasicModal,
  ChipsContainer,
  FullScreenModal,
  SimpleInputDropdown,
  TextBadge,
} from 'src/components';
import {appVersion} from 'src/utils';
import {useIntl} from 'react-intl';
import {ContentRating} from 'src/api/mangadex/types';

interface BasicSettingItemProps {
  title: string;
  disabled?: boolean;
  description?: string;
  disabledDescription?: string;
}

interface TogglableSettingsItemProps extends BasicSettingItemProps {
  value: boolean;
  color?: string;
  onPress?(): void;
  onToggle?(value: boolean): void;
}

interface OptionsSettingsItemProps<T> extends BasicSettingItemProps {
  value: T[];
  defaultValue: T[];
  possibleValues: {value: T; name: string; icon?: string}[];
  defaultSelectionText: string;
  size?: 'full' | 'basic';
  color?: string;
  placeholder?: string;
  onSelect?(value: T[]): void;
}

export default function ShowSettings() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const {session, setSession} = useContext(SessionContext);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [settingsBeforeReset, setSettingsBeforeReset] = useState<Settings>();
  const {
    settings,
    defaultSettings,
    updateSetting,
    resetSettings,
    overrideSettings,
  } = useSettingsContext();

  console.log({settings});

  const possibleSettingsLanguages = usePossibleSettingsLanguages();

  // const spicyModeColor = useBackgroundColor('error');

  const [logout] = usePostRequest('/auth/logout');

  const handleSettingsReset = () => {
    setSettingsBeforeReset(settings);
    resetSettings();
    setSnackbarVisible(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSnackbarVisible(false);
      setSettingsBeforeReset(undefined);
    }, 5000);

    return () => clearTimeout(timer);
  }, [snackbarVisible]);

  const handleLogout = () => {
    if (!session) {
      return;
    }

    logout()
      .then(() => EncryptedStorage.removeItem('user_session'))
      .then(() => setSession(null))
      .then(resetSettings)
      .catch(console.error);
  };

  return (
    <>
      <ScrollView>
        <View
          style={{flex: 1, alignItems: 'center', marginTop: 20, margin: 15}}>
          <Image
            source={{
              uri: `https://api.multiavatar.com/${
                session ? session.username : 'guest'
              }.png`,
            }}
            style={{width: 150, aspectRatio: 1, borderRadius: 150}}
          />
          {session ? (
            <Title>Hi there, {session.username}.</Title>
          ) : (
            <Title>Hi there.</Title>
          )}
          <Text style={{color: theme.colors.disabled, marginBottom: 15}}>
            This is where you can customize how this app behaves. More to come
            soon!
          </Text>
        </View>
        <OptionsSettingsItem
          value={settings.contentRatings}
          defaultValue={defaultSettings.contentRatings}
          possibleValues={possibleSettingsContentRatings}
          onSelect={newValue => updateSetting('contentRatings', newValue)}
          title="Content rating filters"
          description={
            'Please note that the ages are for guidance only. Sexual content is not visible through this app.'
          }
          defaultSelectionText="All content ratings"
        />
        {settings.contentRatings.includes(ContentRating.pornographic) ? (
          <TogglableSettingsItem
            value={settings.blurPornographicEntries}
            onToggle={newValue =>
              updateSetting('blurPornographicEntries', newValue)
            }
            title="Blur 18+ (Hentai) thumbnails"
            description="Blurs 18+ (Hentai) thumbnail images when browsing the app."
          />
        ) : null}
        <OptionsSettingsItem
          size="basic"
          value={settings.mangaLanguages}
          defaultValue={defaultSettings.mangaLanguages}
          possibleValues={possibleSettingsLanguages}
          onSelect={newValue => updateSetting('mangaLanguages', newValue)}
          title="Manga language filters"
          description="When set, only shows manga with chapters translated in the selected languages."
          placeholder="Filter by language..."
          defaultSelectionText="All languages"
        />
        <OptionsSettingsItem
          size="basic"
          value={settings.chapterLanguages}
          defaultValue={defaultSettings.chapterLanguages}
          possibleValues={possibleSettingsLanguages}
          onSelect={newValue => updateSetting('chapterLanguages', newValue)}
          title="Chapter language filters"
          description="Default language used when viewing chapters. Some manga may not have chapters available in your language"
          placeholder="Filter by language..."
          defaultSelectionText="All languages"
        />
        <TogglableSettingsItem
          value={settings.dataSaver}
          onToggle={newValue => {
            console.log({newValue});
            updateSetting('dataSaver', newValue);
          }}
          title="Data saver"
          description="Reduce data usage by viewing lower quality versions of chapters."
        />
        {/* <OptionsSettingsItem
        value={settings.chapterLanguages}
        possibleValues={possibleSettingsLanguages}
        onSelect={newValue => updateSetting('chapterLanguages', newValue)}
        title="Reading direction"
      /> */}
        {/* <TogglableSettingsItem
          disabled={
            !settings.contentRatings.includes(ContentRating.pornographic)
          }
          value={settings.spicyMode}
          onToggle={newValue => updateSetting('spicyMode', newValue)}
          title="Enable spicy mode"
          description="All titles displayed will have a rating of 18+."
          disabledDescription={
            'Select the "For 18+" content rating to enable this setting.'
          }
          color={spicyModeColor}
        /> */}
        <TogglableSettingsItem
          value={settings.lightTheme}
          onToggle={newValue => updateSetting('lightTheme', newValue)}
          title="[BETA] Use light theme"
          description={
            colorScheme === 'light'
              ? 'This will be the theme used by default based on your current system-wide theme.'
              : 'Dark theme not working for you? Try out our new light theme!'
          }
        />

        <View style={{paddingHorizontal: 15}}>
          <Caption>
            You are currently rocking:{' '}
            <Caption style={{fontWeight: 'bold'}}>
              Dexify v{appVersion()}
            </Caption>
          </Caption>
        </View>

        <View style={{margin: 15}}>
          <Button mode="outlined" onPress={handleSettingsReset}>
            Use default settings
          </Button>
          {session ? (
            <Button
              mode="contained"
              onPress={handleLogout}
              style={{marginTop: 10}}>
              Logout
            </Button>
          ) : null}
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Undo',
          onPress: () => {
            settingsBeforeReset && overrideSettings(settingsBeforeReset);
          },
        }}>
        Settings were reset.
      </Snackbar>
    </>
  );
}

function OptionsSettingsItem<T>({
  value,
  defaultValue,
  possibleValues,
  title,
  disabled,
  description,
  placeholder,
  color,
  defaultSelectionText,
  size = 'basic',
  onSelect,
}: OptionsSettingsItemProps<T>) {
  const theme = useTheme();
  const [selected, setSelected] = useState<T[]>(value);
  const [currentSelection, setCurrentSelection] = useState<T[]>(value);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const selectedBackground = useBackgroundColor('disabled');

  const selectedValues = useMemo(
    () =>
      possibleValues.filter(possibleValue =>
        currentSelection.includes(possibleValue.value),
      ),
    [currentSelection],
  );

  const visiblePossibleValues = useMemo(() => {
    if (searchInput.length) {
      return possibleValues.filter(value => {
        return [value.name, value.value].find(potentialValue =>
          String(potentialValue)
            .toLocaleLowerCase()
            .includes(searchInput.toLocaleLowerCase()),
        );
      });
    } else {
      return possibleValues;
    }
  }, [possibleValues, searchInput]);

  useEffect(() => {
    onSelect?.(selected);
  }, [selected]);

  const handlePress = useCallback(
    (item: T) => {
      if (currentSelection.includes(item)) {
        setCurrentSelection(current =>
          current.filter(currentItem => currentItem !== item),
        );
      } else {
        setCurrentSelection(current => [...current, item]);
      }
    },
    [currentSelection],
  );

  const modalProps = {
    title,
    visible: modalOpen,
    onDismiss: () => {
      setCurrentSelection(value);
      setModalOpen(false);
    },
    primaryAction: {
      content: 'Done',
      onAction: () => {
        setModalOpen(false);
        setSelected(currentSelection);
      },
    },
  };

  const modalChildren = () => (
    <>
      <Searchbar
        value={searchInput}
        onChangeText={setSearchInput}
        autoCapitalize="none"
        placeholder={placeholder}
        style={{marginTop: 5, marginHorizontal: 5}}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          padding: 5,
        }}>
        <CategoriesCollectionSection
          data={
            selectedValues.length
              ? selectedValues
              : [{name: defaultSelectionText, value: '' as any}]
          }
          renderItem={item => {
            return (
              <Chip
                selected
                style={{margin: 2}}
                onPress={
                  selectedValues.length
                    ? () => handlePress(item.value)
                    : undefined
                }>
                {item.name}
              </Chip>
            );
          }}
        />
      </View>
      <FlatList
        data={visiblePossibleValues}
        renderItem={({item}) => {
          const selected = currentSelection.includes(item.value);
          const backgroundColor = selected ? selectedBackground : undefined;

          return (
            <TouchableNativeFeedback
              useForeground
              onPress={() => handlePress(item.value)}>
              <View style={{padding: 15, backgroundColor}}>
                <TextBadge
                  style={{marginLeft: -5}}
                  icon={selected ? 'check' : undefined}
                  content={<Text>{item.name}</Text>}
                  background="none"
                />
              </View>
            </TouchableNativeFeedback>
          );
        }}
      />
    </>
  );

  return (
    <View style={{paddingVertical: 20}}>
      <TouchableNativeFeedback useForeground onPress={() => setModalOpen(true)}>
        <View style={{paddingHorizontal: 15}}>
          <Text
            style={{
              color: disabled
                ? theme.colors.disabled
                : color || theme.colors.text,
            }}>
            {title}
          </Text>
          {description ? <Caption>{description}</Caption> : null}
          {size === 'full' ? (
            <FullScreenModal {...modalProps}>{modalChildren()}</FullScreenModal>
          ) : (
            <BasicModal {...modalProps}>{modalChildren()}</BasicModal>
          )}
        </View>
      </TouchableNativeFeedback>

      <View style={{paddingHorizontal: 10}}>
        <CategoriesCollectionSection
          data={
            selected.length
              ? possibleValues.filter(possibleValue =>
                  selected.includes(possibleValue.value),
                )
              : [{name: defaultSelectionText, value: '' as any}]
          }
          renderItem={item => {
            return (
              <TextBadge
                disablePress
                icon="check"
                style={{borderColor: theme.colors.placeholder, borderWidth: 1}}
                content={item.name || item.value}
              />
            );
          }}
        />
      </View>
    </View>
  );
}

function TogglableSettingsItem({
  value,
  title,
  disabled,
  description,
  disabledDescription,
  color,
  onToggle,
}: TogglableSettingsItemProps) {
  const theme = useTheme();
  return (
    <TouchableNativeFeedback
      useForeground
      onPress={disabled ? undefined : () => onToggle?.(!value)}>
      <View
        style={{
          padding: 15,
          marginBottom: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: disabled
                ? theme.colors.disabled
                : color || theme.colors.text,
            }}>
            {title}
          </Text>
          <Switch
            disabled={disabled}
            value={value}
            onValueChange={onToggle}
            color={theme.colors.primary}
          />
        </View>
        {description || (disabled && disabledDescription) ? (
          <Caption>
            {disabled ? disabledDescription || description : description}
          </Caption>
        ) : null}
      </View>
    </TouchableNativeFeedback>
  );
}

function DropdownSettingsItem<T>({
  value,
  possibleValues,
  title,
  disabled,
  description,
  color,
  onSelect,
}: OptionsSettingsItemProps<T>) {
  const theme = useTheme();

  return (
    <View style={{padding: 15, marginBottom: 10}}>
      <Text
        style={{
          color: disabled ? theme.colors.disabled : color || theme.colors.text,
        }}>
        {title}
      </Text>
      {description ? <Caption>{description}</Caption> : null}
      <SimpleInputDropdown
        values={possibleValues.map(value => ({
          id: typeof value.value === 'string' ? value.value : value.name,
          name: value.name,
        }))}
      />
    </View>
  );
}
