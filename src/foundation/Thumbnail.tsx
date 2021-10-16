import React from 'react';
import {View, Image, TouchableNativeFeedback} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';

interface DimensionsProps {
  width: number;
  height: number;
}

interface Props {
  imageUrl: string;
  title: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

export default function Thumbnail({
  imageUrl,
  title,
  width,
  height,
  onPress,
  onLongPress,
}: Props & DimensionsProps) {
  return (
    <View style={{width, flex: 1, flexDirection: 'column'}}>
      <TouchableNativeFeedback
        useForeground
        onLongPress={onLongPress}
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple('#fff', false)}>
        <View>
          <Image
            source={{uri: imageUrl}}
            style={{height, zIndex: -1}}
            resizeMode="cover"
          />
        </View>
      </TouchableNativeFeedback>
      <Text numberOfLines={2}>{title}</Text>
    </View>
  );
}

export function ThumbnailSkeleton({width, height}: DimensionsProps) {
  return <View style={{width, height, backgroundColor: '#fff'}} />;
}
