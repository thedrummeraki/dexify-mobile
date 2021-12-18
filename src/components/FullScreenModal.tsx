import React, {PropsWithChildren} from 'react';
import {View, Modal} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDimensions} from 'src/utils';
import {CloseCurrentScreenHeader} from '.';

interface ModalAction {
  content: string;
  disabled?: boolean;
  onAction(): void;
}

interface Props {
  title?: string;
  visible?: boolean;
  primaryAction?: ModalAction;
  onDismiss(): void;
}

export default function FullScreenModal({
  children,
  title,
  visible,
  primaryAction,
  onDismiss,
}: PropsWithChildren<Props>) {
  const {width, height} = useDimensions();
  const theme = useTheme();

  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent
      onRequestClose={onDismiss}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000000a0',
        }}>
        <View
          style={{
            width: width,
            height: height,
            backgroundColor: theme.colors.background,
          }}>
          <CloseCurrentScreenHeader title={title} onClose={onDismiss} />
          {children}
        </View>
      </View>
    </Modal>
  );
}
