import React, {ComponentProps, useEffect, useState} from 'react';
import {View, Modal} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {useDimensions} from 'src/utils';
import {CloseCurrentScreenHeader} from '.';

interface ModalAction {
  content: string;
  disabled?: boolean;
  onAction(): void;
}

interface BasicProps {
  title?: string;
  visible?: boolean;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  onDismiss(): void;
}

type ModalProps = ComponentProps<typeof Modal>;
type Props = BasicProps & ModalProps;

export default function FullScreenModal({
  children,
  title,
  visible,
  primaryAction,
  secondaryAction,
  ...modalProps
}: Props) {
  const {width, height} = useDimensions();
  const theme = useTheme();

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      {...modalProps}
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
            backgroundColor: theme.colors.surface,
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
        {primaryAction || secondaryAction ? (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              flexDirection: 'row-reverse',
            }}>
            {primaryAction ? (
              <Button
                onPress={primaryAction.onAction}
                disabled={primaryAction.disabled}>
                {primaryAction.content}
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button
                color="white"
                onPress={secondaryAction.onAction}
                disabled={secondaryAction.disabled}>
                {secondaryAction.content}
              </Button>
            ) : null}
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
