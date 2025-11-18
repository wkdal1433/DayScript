/**
 * 앱 전체에서 사용할 일관된 종료 확인 모달
 * 기본 Alert 대신 사용하여 UX 통일성 확보
 */

import React from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, getShadow } from '../../core/constants';

const { width: screenWidth } = Dimensions.get('window');

export interface ExitConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'warning' | 'danger' | 'info';
  icon?: string;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  type = 'warning',
  icon,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          headerColor: COLORS.error[500],
          confirmButtonColor: COLORS.error[500],
          iconColor: COLORS.error[600],
          defaultIcon: '⚠️',
        };
      case 'info':
        return {
          headerColor: COLORS.primary[500],
          confirmButtonColor: COLORS.primary[500],
          iconColor: COLORS.primary[600],
          defaultIcon: 'ℹ️',
        };
      case 'warning':
      default:
        return {
          headerColor: COLORS.warning[500],
          confirmButtonColor: COLORS.warning[500],
          iconColor: COLORS.warning[600],
          defaultIcon: '⚠️',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: `${typeStyles.headerColor}15` }]}>
            <View style={styles.headerContent}>
              <Text style={styles.iconText}>
                {icon || typeStyles.defaultIcon}
              </Text>
              <Text style={[styles.title, { color: typeStyles.headerColor }]}>
                {title}
              </Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: typeStyles.confirmButtonColor }
              ]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING[5],
  },
  modalContainer: {
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
    maxWidth: 400,
    ...getShadow('xl'),
    overflow: 'hidden',
  },
  header: {
    padding: SPACING[5],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[3],
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    ...TYPOGRAPHY.textStyles.h4,
    flex: 1,
  },
  content: {
    padding: SPACING[5],
  },
  message: {
    ...TYPOGRAPHY.textStyles.body,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    padding: SPACING[4],
    gap: SPACING[3],
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  cancelButton: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },
  confirmButton: {
    backgroundColor: COLORS.warning[500],
  },
  cancelButtonText: {
    ...TYPOGRAPHY.textStyles.button,
    color: COLORS.text.primary,
  },
  confirmButtonText: {
    ...TYPOGRAPHY.textStyles.button,
    color: COLORS.text.inverse,
  },
});