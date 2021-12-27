import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Caption, Text, Title} from 'react-native-paper';
import {ImageGradient, TextBadge} from 'src/components';

const Tab = createMaterialTopTabNavigator();

export default function ShowMangaDetailsSkeleton() {
  return (
    <View style={{flex: 1}}>
      <AboutSkeleton />
    </View>
  );
}

function AboutSkeleton() {
  const loadingMessages = [
    {title: 'Fetching the stars...', subtitle: 'Yes, you read right.'},
    {
      title: 'Waiting on Mangadex...',
      subtitle: 'Their ninjas are working hard right now',
    },
    {
      title: 'Hey there! Looking good :)',
      subtitle: 'No really, I really think so.',
    },
    {title: "This souldn't be long", subtitle: 'Patience is a vertue.'},
    {
      title: 'Still waiting :)',
      subtitle: 'Not worth grabbing a cup of coffee!',
    },
    {title: 'Please be patient :)', subtitle: "We'll get there"},
  ];

  const index = Math.floor(Math.random() * loadingMessages.length);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
      <View>
        <ImageGradient aspectRatio={1.2} />

        <FastImage
          source={{uri: 'https://mangadex.org/avatar.png'}}
          style={{width: '100%', aspectRatio: 1.2}}
        />
        <View
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          zIndex: 1,
          marginHorizontal: 15,
        }}>
        <Title style={{lineHeight: 22}}>{loadingMessages[index].title}</Title>
        <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{fontSize: 12, marginTop: 10}}>
            {loadingMessages[index].subtitle}
          </Text>
      </View>
      </View>
    </ScrollView>
  );
}

function EmptyContent() {
  return <View />;
}
