import React, {PropsWithChildren} from 'react';
import {
  View,
  TouchableNativeFeedback,
  Image,
  StyleProp,
  TextStyle,
  ImageStyle,
  ViewStyle,
  Pressable,
} from 'react-native';
import {Badge, Caption, Text, useTheme} from 'react-native-paper';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

export interface ThumbnailDimensionsProps {
  width: number | string;
  height?: number | string;
  aspectRatio?: number;
}

interface BorderOptions {
  color?: string;
  style?: 'solid' | 'dotted' | 'dashed';
  width?: number;
}

interface BasicProps {
  imageUrl: string | string[];
  rounded?: boolean;
  border?: BorderOptions;
  TopComponent?: React.ReactElement;
  BottomComponent?: React.ReactElement;
  onPress?: () => void;
  onSubtitlePress?: () => void;
  onLongPress?: () => void;
}

interface WithTitleProps {
  title?: string;
  subtitle?: string;
  titleContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  hideTitle?: boolean;
  onSubtitlePress?(): void;
}

interface WithSingleImage {
  imageUrl: string;
}

interface WithMultipleImages {
  imageUrl: string[];
}

type SingleImageProps = Omit<BasicProps, 'imageUrl'> &
  WithSingleImage &
  Omit<ThumbnailDimensionsProps, 'width'>;
type MultipleImagesProps = Omit<BasicProps, 'imageUrl'> &
  WithMultipleImages &
  Omit<ThumbnailDimensionsProps, 'width'>;
type Props = BasicProps & WithTitleProps & ThumbnailDimensionsProps;

export default function Thumbnail({
  imageUrl,
  title,
  hideTitle,
  width,
  border,
  ...rest
}: Props) {
  const theme = useTheme();
  const borderStyle: StyleProp<ViewStyle> = border
    ? {
        borderColor: border.color || theme.colors.primary,
        borderStyle: border.style || 'solid',
        borderWidth: border.width || 2,
      }
    : undefined;
  return (
    <View
      style={Object.assign({
        width,
        flex: 1,
        flexDirection: 'column',
      })}>
      <View style={borderStyle}>
        {Array.isArray(imageUrl) ? (
          <MultipleImageView imageUrl={imageUrl} {...rest} />
        ) : (
          <SingleImageView imageUrl={imageUrl} {...rest} />
        )}
      </View>
      <ThumbnailCaption title={title} hideTitle={hideTitle} {...rest} />
    </View>
  );
}

function SingleImageView({
  imageUrl,
  height,
  aspectRatio,
  TopComponent,
  BottomComponent,
  rounded,
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
          style={{
            height,
            aspectRatio,
            zIndex: -1,
            borderRadius: rounded ? 1000 : 0,
          }}
          resizeMode="cover"
        />
        <View style={{position: 'absolute', bottom: 0}}>{BottomComponent}</View>
      </View>
    </MaybeTouchableNativeFeedback>
  );
}

function MultipleImageView({
  imageUrl: imageUrls,
  ...props
}: MultipleImagesProps) {
  const {
    height,
    aspectRatio,
    TopComponent,
    BottomComponent,
    rounded,
    onPress,
    onLongPress,
  } = props;
  if (imageUrls.length < 4) {
    const imageUrl = imageUrls[0];
    return <SingleImageView imageUrl={imageUrl} {...props} />;
  }
  const imagesInfo: {imageUrl?: string; style: StyleProp<ImageStyle>}[] = [
    {
      imageUrl: imageUrls[0],
      style: {
        top: 0,
        left: 0,
        width: '50%',
        aspectRatio: 1,
        position: 'absolute',
      },
    },
    {
      imageUrl: imageUrls[1],
      style: {
        top: 0,
        right: 0,
        width: '50%',
        aspectRatio: 1,
        position: 'absolute',
      },
    },
    {
      imageUrl: imageUrls[2],
      style: {
        bottom: 0,
        left: 0,
        width: '50%',
        aspectRatio: 1,
        position: 'absolute',
      },
    },
    {
      imageUrl: imageUrls[3],
      style: {
        bottom: 0,
        right: 0,
        width: '50%',
        aspectRatio: 1,
        position: 'absolute',
      },
    },
  ];

  return (
    <MaybeTouchableNativeFeedback onLongPress={onLongPress} onPress={onPress}>
      <View style={{borderRadius: rounded ? 1000 : 0}}>
        <View style={{position: 'absolute', zIndex: 1}}>{TopComponent}</View>
        <View style={{flex: 1, height, aspectRatio, position: 'relative'}}>
          {imagesInfo.map((info, index) => {
            if (!info.imageUrl) {
              return null;
            }

            return (
              <Image
                key={`thumb-preview-${index}`}
                source={{uri: info.imageUrl}}
                loadingIndicatorSource={{
                  uri: 'https://mangadex.org/avatar.png',
                }}
                style={info.style}
                resizeMode="cover"
              />
            );
          })}
          <View style={{position: 'absolute', bottom: 0, zIndex: 2}}>
            {BottomComponent}
          </View>
        </View>
      </View>
    </MaybeTouchableNativeFeedback>
  );
}

function ThumbnailCaption({
  title,
  subtitle,
  titleContainerStyle,
  titleStyle,
  subtitleStyle,
  hideTitle,
  onSubtitlePress,
}: WithTitleProps) {
  const theme = useTheme();

  if (title && !hideTitle) {
    return (
      <View style={Object.assign({marginTop: 5}, titleContainerStyle)}>
        {title ? (
          <Caption
            numberOfLines={subtitle ? 1 : 2}
            style={Object.assign(
              {
                lineHeight: 15,
                color: theme.colors.text,
              },
              titleStyle,
            )}>
            {title}
          </Caption>
        ) : null}
        {subtitle ? (
          <Pressable onPress={onSubtitlePress}>
            <Caption
              numberOfLines={title ? 1 : 2}
              style={Object.assign(
                {lineHeight: 15, marginTop: -2},
                subtitleStyle,
              )}>
              {subtitle}
            </Caption>
          </Pressable>
        ) : null}
      </View>
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
  const style = Object.assign({borderRadius: 0, marginRight: 2}, badgeStyle);
  return <Badge style={style}>{children}</Badge>;
}
