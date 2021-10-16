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
