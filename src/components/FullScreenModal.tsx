import React, {PropsWithChildren} from 'react';
import {View, Modal} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {useDimensions} from 'src/utils';
import {CloseCurrentScreenHeader} from '.';

interface ModalAction {
  content: string;
  showCancel?: boolean;
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
      animationType={'slide'}
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
            marginTop: 5,
          }}>
          <CloseCurrentScreenHeader title={title} onClose={onDismiss} />
          <View style={{marginBottom: 104}}>
            {visible ? children : undefined}
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row-reverse',
          }}>
          {primaryAction ? (
            <>
              <Button onPress={primaryAction.onAction}>
                {primaryAction.content}
              </Button>
              {primaryAction.showCancel ? (
                <Button color="white" onPress={onDismiss}>
                  Cancel
                </Button>
              ) : null}
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
