import React from 'react';
import {Dimensions, Image, TouchableNativeFeedback, View} from 'react-native';
import {Caption, Text, useTheme} from 'react-native-paper';
import {useDexifyNavigation} from 'src/foundation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Skeleton from './Skeleton';
import Thumbnail from 'src/foundation/Thumbnail';

interface Props {
  image?: {
    width: number;
    url: string | string[];
    rounded?: boolean;
  };
  imageWidth?: number;
  selected?: boolean;
  title: string;
  subtitle?: string;
  onPress?(): void;
}

export function Item({image, selected, title, subtitle, onPress}: Props) {
  const imageWidth = image?.width || 0;
  const width = Dimensions.get('window').width - 15 * 2 - imageWidth - 5 * 3;

  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 1,
      }}>
      <TouchableNativeFeedback
        useForeground
        onPress={onPress}
        style={{width: '100%'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {selected ? (
            <View
              style={{
                width: imageWidth,
                aspectRatio: 1,
                backgroundColor: theme.colors.primary,
                borderRadius: image?.rounded ? 1000 : 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="check" style={{color: '#000', fontSize: 24}} />
            </View>
          ) : image ? (
            typeof image.url === 'string' ? (
              <Image
                source={{uri: image.url}}
                style={{
                  width: imageWidth,
                  aspectRatio: 1,
                  borderRadius: image?.rounded ? 1000 : 0,
                }}
              />
            ) : (
              <Thumbnail
                rounded={image.rounded}
                imageUrl={image.url}
                width={imageWidth}
                aspectRatio={1}
              />
            )
          ) : null}
          <View style={{paddingVertical: 5, paddingHorizontal: 15}}>
            <Text
              numberOfLines={subtitle ? 1 : 2}
              style={{width, fontWeight: selected ? 'bold' : 'normal'}}>
              {title}
            </Text>
            {subtitle ? (
              <Caption style={{marginTop: 0}}>{subtitle}</Caption>
            ) : null}
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

Item.Skeleton = Skeleton;
