import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, View} from 'react-native';
import {coverImage} from 'src/api';
import {useMangaDetails, VolumeInfo} from '../../../ShowMangaDetails';
import VolumeDetails from './VolumeDetails';
import VolumesList from './VolumesList';

interface Props {
  jumpToVolume?: string | null;
}

export default function VolumesContainer({jumpToVolume}: Props) {
  const {coverUrl, onCoverUrlUpdate, covers, manga} = useMangaDetails();
  const defaultCoverUrl = useRef(coverUrl);

  const [currentVolume, setCurrentVolume] = useState<VolumeInfo | null>(null);

  useEffect(() => {
    const unsubscribe = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (currentVolume) {
          setCurrentVolume(null);
          return true;
        }
      },
    );

    return () => unsubscribe.remove();
  }, [currentVolume]);

  useEffect(() => {
    if (!defaultCoverUrl.current && coverUrl) {
      defaultCoverUrl.current = coverUrl;
    }
  }, [coverUrl]);

  useEffect(() => {
    if (covers.length === 0) {
      return;
    }

    if (currentVolume === null && defaultCoverUrl.current) {
      onCoverUrlUpdate(defaultCoverUrl.current);
      return;
    }

    const cover = covers.find(
      cover => cover.attributes.volume === currentVolume?.volume,
    );
    if (cover) {
      onCoverUrlUpdate(coverImage(cover, manga.id));
    } else if (defaultCoverUrl.current) {
      onCoverUrlUpdate(defaultCoverUrl.current);
    }
  }, [onCoverUrlUpdate, currentVolume, covers, manga.id]);

  if (currentVolume === null) {
    return (
      <VolumesList
        jumpToVolume={jumpToVolume}
        onVolumeSelect={setCurrentVolume}
        defaultCoverUrl={defaultCoverUrl.current}
      />
    );
  }

  return (
    <View style={{marginTop: 15}}>
      <VolumeDetails
        volumeInfo={currentVolume}
        onCancel={() => setCurrentVolume(null)}
        onNextVolume={() => {}}
        onPreviousVolume={() => {}}
      />
    </View>
  );
}
