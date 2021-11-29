import React, {useContext} from 'react';
import {ScrollView} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import BasicList from 'src/components/BasicList';
import {HomeContext} from '../HomeProvider';
import Section from './Section/Section';
import {HomePresenterData} from './Section/types';
import TopManga from './TopManga';

interface Props {
  data: HomePresenterData;
}

export default function HomePresenterView({data}: Props) {
  const {popularManga, readingNow} = useContext(HomeContext);
  const {topManga, homeSections} = data;

  return (
    <ScrollView>
      <TopManga manga={topManga} />
      {homeSections.map(section => (
        <Section key={section.slug} section={section} />
      ))}
    </ScrollView>
  );
}
