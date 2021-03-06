import {DateTime} from 'luxon';
import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

export function appVersion() {
  const pkg = require('../package.json');
  return pkg.version;
}

export function useDebouncedValue<T>(value: T, delay?: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (value === undefined) {
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return value === undefined ? value : debouncedValue;
}

export type ScreenOrientation = 'portrait' | 'landascape';

export function isPortrait() {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
}

export function useDimensions() {
  return Dimensions.get('window');
}

export function useScreenOrientation(): ScreenOrientation {
  const [orientation, setOrientation] = useState<ScreenOrientation>(
    isPortrait() ? 'portrait' : 'landascape',
  );

  useEffect(() => {
    const callback = () =>
      setOrientation(isPortrait() ? 'portrait' : 'landascape');

    const event = Dimensions.addEventListener('change', callback);
    return () => event.remove();
  }, []);

  return orientation;
}

export function onlyUnique<T>(value: T, index: number, array: Array<T>) {
  return array.indexOf(value) === index;
}

// The closer the result is to 1, the more similar these `s1` and `s2` are.
// Info: https://en.wikipedia.org/wiki/Levenshtein_distance
// Source: https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
//
// Limitations:
// If `s1` is "Shinka no Mi" and `s2` is "Shinka no Mi: Shiranai Uchi ni Kachigumi Jinei", the distance
// will be very far off because of these strings will be seen as "different" (probably due to their
// respective length) even if they start with the same "Shinka no Mi".
export function levenshteinDistance(s1: string, s2: string) {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  const longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) /
    parseFloat(String(longerLength))
  );
}

function editDistance(s1: string, s2: string) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  const costs = new Array<number>();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i == 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue;
    }
  }
  return costs[s2.length];
}

export function isNumber(string: string) {
  return !isNaN(parseFloat(string));
}

export function occurences<T>(array: T[], value: T) {
  let count = 0;
  array.forEach(actual => {
    if (actual === value) {
      count += 1;
    }
  });

  return count;
}

export function pluralize(
  count: number,
  singular: string,
  options?: {
    zeroPrefix?: string;
    singularNumberText?: string;
    plural?: string;
    invariable?: boolean;
  },
) {
  const {singularNumberText, plural, invariable} = options || {};
  if (count === 1) {
    return [singularNumberText || '1', singular].join(' ');
  }

  const pluralText = invariable
    ? singular
    : plural !== undefined
    ? plural
    : `${singular}s`;
  return [
    count === 0 ? options?.zeroPrefix || 'No' : String(count),
    pluralText,
  ].join(' ');
}

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function max(a: number, b: number) {
  return a < b ? b : a;
}

export function min(a: number, b: number) {
  return a < b ? a : b;
}

export function localizedDateTime(
  dateTimeISO?: string | null,
  format: Intl.DateTimeFormatOptions = DateTime.DATETIME_FULL,
  locale = 'en',
) {
  if (!dateTimeISO) {
    return null;
  }

  const dateTime = DateTime.fromISO(dateTimeISO);
  return dateTime.toLocaleString(format, {locale});
}

export const timeAgo = (
  date: string | null | undefined,
  options?: {showDate?: boolean; capitalize?: boolean},
) => {
  if (!date) {
    return null;
  }

  const units = [
    'year',
    'month',
    'week',
    'day',
    'hour',
    'minute',
    'second',
  ] as Intl.RelativeTimeFormatUnit[];

  let dateTime = DateTime.fromISO(date);
  const diff = dateTime.diffNow().shiftTo(...units);
  const unit = units.find(unit => diff.get(unit) !== 0) || 'second';

  const relativeFormatter = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
  });
  let relativeTimeInWords = relativeFormatter.format(
    Math.trunc(diff.as(unit)),
    unit,
  );

  if (options?.capitalize) {
    relativeTimeInWords = capitalize(relativeTimeInWords);
  }

  if (options?.showDate) {
    return `${relativeTimeInWords} (${dateTime.toLocaleString(
      DateTime.DATE_FULL,
    )})`;
  }

  return relativeTimeInWords;
};
