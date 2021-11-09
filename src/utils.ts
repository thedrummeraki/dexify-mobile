import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

export function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export type ScreenOrientation = 'portrait' | 'landascape';

export function isPortrait() {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
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
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
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
