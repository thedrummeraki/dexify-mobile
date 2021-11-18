import React, {PropsWithChildren} from 'react';
import {
  View,
  TouchableNativeFeedback,
  Image,
  StyleProp,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {Badge, Caption, useTheme} from 'react-native-paper';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

export interface ThumbnailDimensionsProps {
  width: number | string;
  height?: number | string;
  aspectRatio?: number;
}

interface BasicProps {
  imageUrl: string | string[];
  TopComponent?: React.ReactElement;
  BottomComponent?: React.ReactElement;
  onPress?: () => void;
  onLongPress?: () => void;
}

interface WithTitleProps {
  title?: string;
  hideTitle?: boolean;
}

interface WithSingleImage {
  imageUrl: string;
}

interface WithMultipleImages {
  imageUrl: string[];
}

type SingleImageProps = Omit<BasicProps, 'imageUrl'> & WithSingleImage & Omit<ThumbnailDimensionsProps, 'width'>;
type MultipleImagesProps = Omit<BasicProps, 'imageUrl'> & WithMultipleImages & Omit<ThumbnailDimensionsProps, 'width'>;
type Props = BasicProps & WithTitleProps & ThumbnailDimensionsProps;

export default function Thumbnail({
  imageUrl,
  title,
  hideTitle,
  width,
  ...rest
}: Props) {
  return (
    <View style={{width, flex: 1, flexDirection: 'column'}}>
      {Array.isArray(imageUrl) ? (
        <MultipleImageView imageUrl={imageUrl} {...rest} />
      ) : (
        <SingleImageView imageUrl={imageUrl} {...rest} />
      )}
      <ThumbnailCaption title={title} hideTitle={hideTitle} />
    </View>
  );
}

function SingleImageView({
  imageUrl,
  height,
  aspectRatio,
  TopComponent,
  BottomComponent,
  onPress,
  onLongPress,
}: SingleImageProps) {
  return (
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
  );
}

function MultipleImageView({imageUrl: imageUrls, ...props}: MultipleImagesProps) {
  const {
    height,
    aspectRatio,
    TopComponent,
    BottomComponent,
    onPress,
    onLongPress,
  } = props;
  if (imageUrls.length < 2) {
    const imageUrl = imageUrls[0];
    return (
      <SingleImageView imageUrl={imageUrl} {...props} />
    )
  }
  const imagesInfo: {imageUrl?: string, style: StyleProp<ImageStyle>}[] = [
    {
      imageUrl: imageUrls[0],
      style: {top: 0, left: 0, width: '50%', aspectRatio: 1, position: 'absolute'},
    },
    {
      imageUrl: imageUrls[1],
      style: {top: 0, right: 0, width: '50%', aspectRatio: 1, position: 'absolute'},
    },
    {
      imageUrl: imageUrls[2],
      style: {bottom: 0, left: 0, width: '50%', aspectRatio: 1, position: 'absolute'},
    },
    {
      imageUrl: imageUrls[3],
      style: {bottom: 0, right: 0, width: '50%', aspectRatio: 1, position: 'absolute'},
    }
  ]

  return (
    <MaybeTouchableNativeFeedback onLongPress={onLongPress} onPress={onPress}>
      <View>
        <View style={{position: 'absolute'}}>{TopComponent}</View>
        <View style={{flex: 1, height, aspectRatio, position: 'relative'}}>
          {imagesInfo.map((info, index) => {
            if (!info.imageUrl) {
              return null;
            }

            return (
              <Image
                key={`thumb-preview-${index}`}
                source={{uri: info.imageUrl}}
                loadingIndicatorSource={{uri: 'https://mangadex.org/avatar.png'}}
                style={info.style}
                resizeMode="cover"
              />
            )
          })}
          <View style={{position: 'absolute', bottom: 0, zIndex: 2}}>
            {BottomComponent}
          </View>
        </View>
      </View>
    </MaybeTouchableNativeFeedback>
  )
}

function ThumbnailCaption({title, hideTitle}: WithTitleProps) {
  if (title && !hideTitle) {
    return (
      <Caption numberOfLines={2} style={{lineHeight: 15}}>
        {title}
      </Caption>
    );
  }

  return null;
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

export function ThumbnailSkeleton({
  width,
  height,
  aspectRatio,
}: ThumbnailDimensionsProps) {
  const theme = useTheme();

  return (
    <SkeletonContent
      isLoading
      containerStyle={{width, height, aspectRatio, flex: 1}}
      animationDirection="horizontalRight"
      layout={[{key: 'image', width, height}]}
      boneColor="#222"
      highlightColor="#333333"
    />
  );
}

export function ThumbnailBadge({
  children,
  badgeStyle,
}: {
  children?: React.ReactText;
  badgeStyle?: StyleProp<TextStyle>;
}) {
  const style = Object.assign(
    {borderRadius: 0, marginRight: 2},
    badgeStyle,
  );
  return <Badge style={style}>{children}</Badge>;
}
