import React, {ComponentProps} from 'react';
import {Modal, View} from 'react-native';
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
}

type ModalProps = ComponentProps<typeof Modal>;
type Props = BasicProps & ModalProps;

export default function BasicModal({
  children,
  title,
  primaryAction,
  visible,
  ...modalProps
}: Props) {
  const theme = useTheme();
  const {width, height} = useDimensions();
  const modalWidth = width - 30;
  const modalHeight = (height * 2) / 3;

  return (
    <Modal visible={visible} transparent animationType="fade" {...modalProps}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: theme.colors.backdrop,
        }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: modalWidth,
            height: modalHeight,
            backgroundColor: theme.colors.surface,
            paddingTop: 10,
            marginHorizontal: 15,
            overflow: 'hidden',
            borderRadius: 15,
          }}>
          <CloseCurrentScreenHeader
            title={title}
            onClose={modalProps.onDismiss}
          />
          <View style={{marginBottom: 100}}>
            {visible ? children : undefined}
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
      </View>
    </Modal>
  );
}
