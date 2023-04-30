# Dexify

![version](https://img.shields.io/badge/version-1.2-blue)

![banner](./dexify-banner.png)

Welcome to [Dexify](https://www.akinyele.ca/projects/dexify-mobile). Discover and Read Manga from the comfort of your Android smartphone. <i>iOS version coming soon.</i>

<a href="https://play.google.com/store/apps/details?id=com.dexifymobile"><img alt="google play badge" src="https://raw.githubusercontent.com/steverichey/google-play-badge-svg/266d2b2df26f10d3c00b8129a0bd9f6da6b19f00/img/en_get.svg" width="150" /></a>

## Usage

### Google Play

The app is available in the following countries:

- United States of America
- Canada
- United Kingdom
- Australia

You must be running Android 11 (API 31) or later in order to run the app.

### Github releases

If you wish to install the APK directly to your device, check the [Releases](https://github.com/thedrummeraki/dexify-mobile/releases) tag on this Github repository.

> Note: the Github releases may not be always up to date with the `main` branch or the Google Play releases.

### Locally

This is a React Native app. You can run the app on your local computer. Requirements:

- Yarn
- Android SDK (must support version API 31 or later)
- Android smartphone with development mode enabled

The iOS version of the app has not been worked on at the moment so it cannot be ran on your local device. Support coming soon.

Please follow React Native's [development environment setup](https://reactnative.dev/docs/environment-setup) steps if you haven't set up a React Native project yet.

Once done, open two terminal windows:

```bash
# window 1 -- starts Metro
yarn start
```

```bash
# window 2 -- builds and installs the app to your Android device
yarn android
```

## About

**This is _not_ an official Mangadex mobile client**.

The app uses [Mangadex](https://mangadex.org)'s services ([ref](https://api.mangadex.org)) to display information. Anime information is taken from [youranime.moe](https://youranime.moe) which itself comes from [Kitsu](https://kitsu.io) and [Anilist](https://anilist.co).

The ability to read manga on this app is provided by Mangadex where the ability to read from official is provided whenever possible. See [Mangadex](https://mangadex.org) to learn more how they manage their data.
