/**
 * SuccessModal Types
 *
 * 성공 모달 컴포넌트 관련 타입 정의
 */

export interface SuccessModalProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  buttonText?: string;
  onClose: () => void;
  onConfirm?: () => void;
  showIcon?: boolean;
  iconType?: 'success' | 'checkmark' | 'star' | 'trophy';
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export interface SuccessModalStyles {
  backdrop: any;
  modalContainer: any;
  modalContent: any;
  iconContainer: any;
  icon: any;
  textContainer: any;
  title: any;
  message: any;
  buttonContainer: any;
  closeButton: any;
}