/**
 * LoginScreen Component
 *
 * 로그인 화면 - Figma 디자인 기반 구현
 * 기존 디자인 시스템과 일관성을 유지하며 그라데이션 버튼 스타일 적용
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { NextButton } from '../../components/ui/NextButton';
import { LoginSuccessModal } from '../../components/common/ui';
import { styles } from './LoginScreen.styles';
import { COLORS } from '../../constants';
import type {
  LoginScreenProps,
  LoginFormData,
  InputFieldProps,
  SocialLoginProvider,
} from './LoginScreen.types';

// InputField 컴포넌트
const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleTogglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
        error && styles.inputError,
      ]}>
        {secureTextEntry ? (
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder={placeholder}
              placeholderTextColor={COLORS.textMuted}
              value={value}
              onChangeText={onChangeText}
              secureTextEntry={!isPasswordVisible}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={handleTogglePassword}
              accessibilityLabel={isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              <Text style={styles.eyeIcon}>
                {isPasswordVisible ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCorrect={false}
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// SocialLoginButton 컴포넌트
const SocialLoginButton: React.FC<{
  provider: SocialLoginProvider;
  onPress: () => void;
  disabled?: boolean;
}> = ({ provider, onPress, disabled = false }) => {
  const [isPressed, setIsPressed] = useState(false);

  const getProviderIcon = () => {
    switch (provider) {
      case 'google':
        return '🌐';
      case 'apple':
        return '🍎';
      case 'facebook':
        return '📘';
      default:
        return '🔗';
    }
  };

  const getProviderName = () => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'apple':
        return 'Apple';
      case 'facebook':
        return 'Facebook';
      default:
        return provider;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.socialButton,
        isPressed && styles.socialButtonPressed,
      ]}
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.8}
    >
      <Text style={[styles.socialIcon, provider === 'google' && styles.googleIcon]}>
        {getProviderIcon()}
      </Text>
      <Text style={styles.socialButtonText}>{getProviderName()}</Text>
    </TouchableOpacity>
  );
};

// Main LoginScreen 컴포넌트
export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onForgotPassword,
  onSignUp,
  onSocialLogin,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // 컴포넌트 마운트 시 페이드인 애니메이션
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // 폼 유효성 검증
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    // 아이디 검증 (테스트 계정 또는 이메일 형식)
    if (!formData.email.trim()) {
      newErrors.email = '아이디를 입력해주세요.';
    } else if (formData.email !== 'test123' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '아이디는 test123 또는 이메일 형식으로 입력해주세요.';
    }

    // 비밀번호 검증
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 로그인 처리
  const handleLogin = () => {
    if (!validateForm()) {
      Alert.alert('입력 오류', '입력 정보를 확인해주세요.');
      return;
    }

    // 테스트 계정 확인
    const isTestAccount = formData.email === 'test123' && formData.password === 'test123';

    if (isTestAccount) {
      // 테스트 계정으로 로그인 성공 - 커스텀 모달 표시
      setShowSuccessModal(true);
    } else {
      // 잘못된 계정 정보 - 기본 Alert 유지 (에러 알림)
      Alert.alert(
        '로그인 실패',
        '아이디 또는 비밀번호가 올바르지 않습니다.\n\n테스트 계정:\n아이디: test123\n비밀번호: test123'
      );
    }
  };

  // 소셜 로그인 처리
  const handleSocialLogin = (provider: SocialLoginProvider) => {
    // 소셜 로그인 성공 시에도 커스텀 모달 표시
    setShowSuccessModal(true);
  };

  // 성공 모달 닫기 및 홈 화면 이동
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // 로그인 성공 후 홈 화면으로 이동
    onLogin?.(formData);
  };

  // 폼 데이터 업데이트
  const updateFormData = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // 에러가 있던 필드의 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>DS</Text>
          </View>
          <Text style={styles.title}>환영합니다!</Text>
          <Text style={styles.subtitle}>
            계정에 로그인하여 학습을 계속하세요
          </Text>
        </Animated.View>

        {/* Form Content */}
        <View style={styles.contentContainer}>
          <View style={styles.formContainer}>
            <InputField
              label="아이디"
              placeholder="test123"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              keyboardType="default"
              autoCapitalize="none"
              error={errors.email}
            />

            <InputField
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              secureTextEntry
              error={errors.password}
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={onForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>
              비밀번호를 잊으셨나요?
            </Text>
          </TouchableOpacity>

          {/* Login Button - 기존 그라데이션 버튼 스타일 사용 */}
          <View style={styles.loginButtonContainer}>
            <NextButton
              title="로그인"
              onPress={handleLogin}
              variant="primary"
              disabled={isLoading}
              style={{ width: '100%' }}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <View style={styles.socialLoginContainer}>
            <View style={styles.socialButtonsRow}>
              <SocialLoginButton
                provider="google"
                onPress={() => handleSocialLogin('google')}
                disabled={isLoading}
              />
              <SocialLoginButton
                provider="apple"
                onPress={() => handleSocialLogin('apple')}
                disabled={isLoading}
              />
            </View>
          </View>

          {/* Sign Up */}
          <View style={styles.signUpContainer}>
            <View style={styles.signUpRow}>
              <Text style={styles.signUpText}>계정이 없으신가요?</Text>
              <TouchableOpacity onPress={onSignUp}>
                <Text style={styles.signUpLink}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>로그인 중...</Text>
          </View>
        </View>
      )}

      {/* Success Modal */}
      <LoginSuccessModal
        isVisible={showSuccessModal}
        onClose={handleSuccessModalClose}
        buttonText="시작하기"
        iconType="checkmark"
        showIcon={true}
      />
    </View>
  );
};

export default LoginScreen;