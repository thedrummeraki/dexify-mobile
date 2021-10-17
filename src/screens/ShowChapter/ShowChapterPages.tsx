import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';

interface Page {
  number: number;
  originalImageUrl: string;
  dataSaverImageUrl: string;
}

interface Props {
  pages: Page[];
}

export default function ShowChapterPages({pages}: Props) {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(pages[0]);
  const [fullWidth, setFullWidth] = useState(false);

  const width = Dimensions.get('screen').width;

  return (
    <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
      {loading && <ActivityIndicator style={{flex: 1}} size="large" />}
      <TouchableWithoutFeedback onPress={() => setFullWidth(!fullWidth)}>
        <View>
          <Image
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            style={{
              width: fullWidth ? '100%' : width,
              height: '100%',
              resizeMode: 'contain',
            }}
            source={{uri: currentPage.dataSaverImageUrl}}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
