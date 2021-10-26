import React, {PropsWithChildren} from 'react';
import {View, TouchableNativeFeedback, Image} from 'react-native';
import {Caption} from 'react-native-paper';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

interface DimensionsProps {
  width: number | string;
  height?: number | string;
  aspectRatio?: number;
  showTitle?: boolean;
}

interface Props {
  imageUrl: string;
  title?: string;
  hideTitle?: boolean;
  TopComponent?: React.ReactElement;
  BottomComponent?: React.ReactElement;
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
  BottomComponent,
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
            loadingIndicatorSource={{uri: 'https://mangadex.org/avatar.png'}}
            style={{height, aspectRatio, zIndex: -1}}
            resizeMode="cover"
          />
          <View style={{position: 'absolute', bottom: 0}}>
            {BottomComponent}
          </View>
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
  return (
    <SkeletonContent
      isLoading
      containerStyle={{width, height}}
      animationDirection="horizontalRight"
      layout={[{key: 'image', width, height}]}
    />
  );
}
