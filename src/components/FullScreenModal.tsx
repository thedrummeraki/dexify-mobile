import React, {ComponentProps} from 'react';
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

interface BasicProps {
  title?: string;
  visible?: boolean;
  primaryAction?: ModalAction;
  onDismiss(): void;
}

type ModalProps = ComponentProps<typeof Modal>;
type Props = BasicProps & ModalProps;

export default function FullScreenModal({
  children,
  title,
  visible,
  primaryAction,
  ...modalProps
}: Props) {
  const {width, height} = useDimensions();
  const theme = useTheme();

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={modalProps.onDismiss}>
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
            paddingTop: 10,
          }}>
          <CloseCurrentScreenHeader
            title={title}
            onClose={modalProps.onDismiss}
          />
          <View style={{marginBottom: 114}}>
            {visible ? children : undefined}
          </View>
        </View>
        {primaryAction ? (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              flexDirection: 'row-reverse',
            }}>
            <Button onPress={primaryAction.onAction}>
              {primaryAction.content}
            </Button>
            {primaryAction.showCancel ? (
              <Button color="white" onPress={modalProps.onDismiss}>
                Cancel
              </Button>
            ) : null}
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
