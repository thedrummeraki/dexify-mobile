import React, {useState} from 'react';
import {View} from 'react-native';
import {Tabs, TabScreen} from 'react-native-paper-tabs';
import {onlyUnique} from 'src/utils';

type Props = {
  tabs: DynamicTab[];
} & Omit<React.ComponentProps<typeof Tabs>, 'children'>;

export interface DynamicTab {
  title: string;
  content: () => React.ReactElement;
}

export default function DynamicTabs({tabs, ...rest}: Props) {
  const [loaded, setLoaded] = useState<number[]>([0]);

  const tabScreens = tabs.map((tab, index) => {
    return (
      <TabScreen key={`tab-${index}`} label={tab.title}>
        {loaded[index] === index ? tab.content() : <View />}
      </TabScreen>
    );
  });

  return (
    <Tabs
      onChangeIndex={index =>
        setLoaded(loaded => loaded.concat([index]).filter(onlyUnique))
      }
      {...rest}>
      {tabScreens}
    </Tabs>
  );
}
