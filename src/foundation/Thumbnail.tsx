import React, {PropsWithChildren} from 'react';
import {View, Image, TouchableNativeFeedback} from 'react-native';
import {Caption} from 'react-native-paper';

interface DimensionsProps {
  width: number | string;
  height?: number | string;
  aspectRatio?: number;
}

interface Props {
  imageUrl: string;
  title?: string;
  hideTitle?: boolean;
  TopComponent?: React.ReactElement;
  onPress?: () => void;
  onLongPress?: () => void;
}

export default function Thumbnail({
  imageUrl,
  title,
  hideTitle,
  width,
  height,
  aspectRatio,
  TopComponent,
  onPress,
  onLongPress,
}: Props & DimensionsProps) {
  return (
    <View style={{width, flex: 1, flexDirection: 'column'}}>
      <MaybeTouchableNativeFeedback onLongPress={onLongPress} onPress={onPress}>
        <View>
          <View style={{position: 'absolute'}}>{TopComponent}</View>
          <Image
            source={{uri: imageUrl}}
            style={{height, aspectRatio, zIndex: -1}}
            resizeMode="cover"
          />
        </View>
      </MaybeTouchableNativeFeedback>
      {title && !hideTitle ? (
        <Caption numberOfLines={2}>{title}</Caption>
      ) : undefined}
    </View>
  );
}

function MaybeTouchableNativeFeedback({
  onPress,
  onLongPress,
  children,
}: PropsWithChildren<Pick<Props, 'onPress' | 'onLongPress'>>) {
  if (onPress || onLongPress) {
    return (
      <TouchableNativeFeedback
        useForeground
        onLongPress={onLongPress}
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple('#fff', false)}>
        {children}
      </TouchableNativeFeedback>
    );
  } else {
    return <View>{children}</View>;
  }
}

export function ThumbnailSkeleton({width, height}: DimensionsProps) {
  return <View style={{width, height, backgroundColor: '#fff'}} />;
}
