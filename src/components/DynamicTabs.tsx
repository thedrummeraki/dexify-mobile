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
  renderIf?: () => boolean;
}

export default function DynamicTabs({tabs, ...rest}: Props) {
  const [loaded, setLoaded] = useState<number[]>([0]);

  const tabScreens = tabs
    .filter(tab => tab.renderIf === undefined || tab.renderIf())
    .map((tab, index) => {
      return (
        <TabScreen key={`tab-${index}`} label={tab.title}>
          {loaded.includes(index) &&
          (tab.renderIf === undefined || tab.renderIf()) ? (
            tab.content()
          ) : (
            <View />
          )}
        </TabScreen>
      );
    });

  return (
    <Tabs
      onChangeIndex={index =>
        setLoaded(loaded => loaded.concat([index]).filter(onlyUnique).sort())
      }
      {...rest}>
      {tabScreens}
    </Tabs>
  );
}
