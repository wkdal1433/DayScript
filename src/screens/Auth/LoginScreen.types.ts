/**
 * LoginScreen Types
 *
 * 로그인 화면 관련 타입 정의
 */

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginScreenProps {
  onLogin?: (data: LoginFormData) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onSocialLogin?: (provider: SocialLoginProvider) => void;
  isLoading?: boolean;
}

export type SocialLoginProvider = 'google' | 'apple' | 'facebook';

export interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
}

export interface SocialLoginButtonProps {
  provider: SocialLoginProvider;
  onPress: () => void;
  disabled?: boolean;
}