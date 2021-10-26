import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, Caption, Text, Title} from 'react-native-paper';
import {TextBadge} from 'src/components';

const Tab = createMaterialTopTabNavigator();

export default function ShowMangaDetailsSkeleton() {
  return (
    <View style={{flex: 1}}>
      <View style={{}} />

      <Tab.Navigator>
        <Tab.Screen name="About" component={AboutSkeleton} />
        <Tab.Screen name="Read" component={EmptyContent} />
        <Tab.Screen name="Anime" component={EmptyContent} />
        <Tab.Screen name="Gallery" component={EmptyContent} />
      </Tab.Navigator>
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
      <FastImage
        source={{uri: 'https://mangadex.org/avatar.png'}}
        style={{width: '100%', aspectRatio: 2}}
      />
      <View style={{padding: 5}}>
        <View style={{flex: 1}}>
          <Title>{loadingMessages[index].title}</Title>
          <Caption style={{marginTop: -3, fontWeight: '700'}}>
            {loadingMessages[index].subtitle}
          </Caption>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginTop: 7,
          }}>
          <TextBadge content="Please" background="accent" />
          <TextBadge content="wait..." background="disabled" />
        </View>
        <View style={{flex: 1, marginTop: 22, marginBottom: 12}}>
          <Button loading mode="contained" style={{marginVertical: 3}}>
            {''}
          </Button>
          <Button
            loading
            icon="plus"
            mode="outlined"
            style={{marginVertical: 3}}>
            {''}
          </Button>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginTop: 3,
          }}>
          <Text style={{marginRight: 6}}>Made by:</Text>
          <TextBadge content="Yours Truly" background="surface" />
        </View>
      </View>
    </ScrollView>
  );
}

function EmptyContent() {
  return <View />;
}
