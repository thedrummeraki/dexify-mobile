import React from 'react';
import {View, Image} from 'react-native';
import {Text} from 'react-native-paper';

interface DimensionsProps {
  width: number;
  height: number;
}

interface Props {
  imageUrl: string;
  title: string;
}

export default function Thumbnail({
  imageUrl,
  title,
  width,
  height,
}: Props & DimensionsProps) {
  return (
    <View style={{width, flex: 1, flexDirection: 'column'}}>
      <Image source={{uri: imageUrl}} style={{height}} resizeMode="cover" />
      {/* <Text style={{flexWrap: 'wrap', height: 40}}>{title}</Text> */}
    </View>
  );
}

export function ThumbnailSkeleton({width, height}: DimensionsProps) {
  return <View style={{width, height, backgroundColor: '#fff'}} />;
}
