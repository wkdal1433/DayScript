import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { styles } from '../../screens/Home/Home.styles';

const BellIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
      stroke="#F2BED1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SettingsIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98466 18.3924 8.24634 18.3715 8.51677C18.3506 8.78721 18.3938 9.05877 18.4975 9.30938C18.6013 9.55999 18.7627 9.78258 18.9687 9.95905C19.1747 10.1355 19.4194 10.2609 19.683 10.325C21.439 10.751 21.439 13.249 19.683 13.675C19.4192 13.7389 19.1742 13.8642 18.968 14.0407C18.7618 14.2172 18.6001 14.4399 18.4963 14.6907C18.3924 14.9414 18.3491 15.2132 18.3701 15.4838C18.3911 15.7544 18.4757 16.0162 18.617 16.248C19.557 17.791 17.791 19.558 16.247 18.618C16.0153 18.4769 15.7537 18.3924 15.4832 18.3715C15.2128 18.3506 14.9412 18.3938 14.6906 18.4975C14.44 18.6013 14.2174 18.7627 14.0409 18.9687C13.8645 19.1747 13.7391 19.4194 13.675 19.683C13.249 21.439 10.751 21.439 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4963C9.05859 18.3924 8.78683 18.3491 8.51621 18.3701C8.24559 18.3911 7.98375 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0153 5.60755 15.7537 5.62848 15.4832C5.64942 15.2128 5.60624 14.9412 5.50247 14.6906C5.3987 14.44 5.23726 14.2174 5.03127 14.0409C4.82529 13.8645 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78683 5.62987 8.51621C5.60889 8.24559 5.5243 7.98375 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C7.98466 5.5231 8.24634 5.60755 8.51677 5.62848C8.78721 5.64942 9.05877 5.60624 9.30938 5.50247C9.55999 5.3987 9.78258 5.23726 9.95905 5.03127C10.1355 4.82529 10.2609 4.58056 10.325 4.317Z"
      stroke="#F2BED1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke="#F2BED1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * AdvancedTypewriterCycle Component
 *
 * 고급 터미널 타이핑 애니메이션을 제공하는 컴포넌트입니다.
 * 두 개의 문구를 번갈아가며 타이핑하고, 각 문구마다 다른 색상 스타일을 적용합니다.
 *
 * 애니메이션 사이클:
 * 1. "user@system~$ DayScript |" 타이핑 → 1초 대기 → 사라짐
 * 2. "Hello, World!" 타이핑 (Hello: terminalText 색상, World!: appName 색상) → 1초 대기 → 사라짐
 * 3. 무한 반복
 *
 * @param speed - 타이핑 속도 (밀리초 단위, 기본값: 80ms)
 * @param startDelay - 애니메이션 시작 전 지연 시간 (밀리초 단위, 기본값: 300ms)
 * @param pauseDuration - 각 문구 타이핑 완료 후 대기 시간 (밀리초 단위, 기본값: 1000ms)
 *
 * @example
 * <AdvancedTypewriterCycle
 *   speed={80}
 *   startDelay={300}
 *   pauseDuration={1000}
 * />
 */
interface AdvancedTypewriterCycleProps {
  speed?: number;
  startDelay?: number;
  pauseDuration?: number;
}

/**
 * 애니메이션 단계를 정의하는 열거형
 */
enum AnimationPhase {
  WAITING = 'waiting',      // 대기 중
  TYPING = 'typing',        // 타이핑 중
  PAUSED = 'paused',        // 완료 후 대기
  CLEARING = 'clearing'     // 지우는 중
}

/**
 * 문구 정보를 정의하는 인터페이스
 */
interface PhraseConfig {
  id: string;
  text: string;
  renderFunction: (displayedText: string) => JSX.Element[];
}

const AdvancedTypewriterCycle: React.FC<AdvancedTypewriterCycleProps> = ({
  speed = 80,
  startDelay = 300,
  pauseDuration = 1000,
}) => {
  // 상태 관리
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>(AnimationPhase.WAITING);

  /**
   * 첫 번째 문구 렌더링 함수 - "user@system~$ DayScript |"
   * 기존 스타일 분리를 유지
   */
  const renderFirstPhrase = (text: string): JSX.Element[] => {
    const parts = [];
    const userPrompt = 'user@system~$ ';
    const appName = 'DayScript';

    // user@system~$ 부분 (터미널 프롬프트 스타일)
    if (text.length > 0) {
      const userPromptPart = text.substring(0, Math.min(text.length, userPrompt.length));
      if (userPromptPart) {
        parts.push(
          <Text key="prompt" style={styles.terminalText}>
            {userPromptPart}
          </Text>
        );
      }
    }

    // DayScript 부분 (앱 이름 스타일)
    if (text.length > userPrompt.length) {
      const appNameStart = userPrompt.length;
      const appNameEnd = userPrompt.length + appName.length;
      const appNamePart = text.substring(appNameStart, Math.min(text.length, appNameEnd));
      if (appNamePart) {
        parts.push(
          <Text key="appname" style={styles.appName}>
            {appNamePart}
          </Text>
        );
      }
    }

    // | 커서 부분 (터미널 스타일)
    if (text.length > userPrompt.length + appName.length) {
      const cursorStart = userPrompt.length + appName.length;
      const cursorPart = text.substring(cursorStart);
      if (cursorPart) {
        parts.push(
          <Text key="cursor" style={styles.terminalText}>
            {cursorPart}
          </Text>
        );
      }
    }

    return parts;
  };

  /**
   * 두 번째 문구 렌더링 함수 - "Hello, World!" (듀얼 컬러)
   * Hello, → terminalText 스타일 (Color A)
   * World! → appName 스타일 (Color B)
   */
  const renderSecondPhrase = (text: string): JSX.Element[] => {
    const parts = [];
    const firstPart = 'Hello, ';

    // "Hello, " 부분 (터미널 텍스트 색상)
    if (text.length > 0) {
      const firstPartText = text.substring(0, Math.min(text.length, firstPart.length));
      if (firstPartText) {
        parts.push(
          <Text key="hello" style={styles.terminalText}>
            {firstPartText}
          </Text>
        );
      }
    }

    // "World!" 부분 (앱 이름 색상)
    if (text.length > firstPart.length) {
      const secondPartStart = firstPart.length;
      const secondPartText = text.substring(secondPartStart);
      if (secondPartText) {
        parts.push(
          <Text key="world" style={styles.appName}>
            {secondPartText}
          </Text>
        );
      }
    }

    return parts;
  };

  // 🔧 FIX: useMemo를 사용하여 phrases 배열을 메모이제이션하고 안정화
  const phrases: PhraseConfig[] = useMemo(() => [
    {
      id: 'terminal',
      text: 'user@system~$ DayScript |',
      renderFunction: renderFirstPhrase,
    },
    {
      id: 'greeting',
      text: 'Hello, World!',
      renderFunction: renderSecondPhrase,
    },
  ], []);

  // 🔧 FIX: currentPhrase를 useMemo로 안정화
  const currentPhrase = useMemo(() =>
    phrases[currentPhraseIndex],
    [phrases, currentPhraseIndex]
  );

  /**
   * 초기 시작 지연 처리
   */
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setAnimationPhase(AnimationPhase.TYPING);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [startDelay]);

  /**
   * 🔧 FIX: 타이핑 애니메이션 로직 - currentPhrase 의존성 추가
   */
  useEffect(() => {
    if (animationPhase !== AnimationPhase.TYPING || currentIndex >= currentPhrase.text.length) {
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(prev => prev + currentPhrase.text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, animationPhase, currentPhrase, speed]);

  /**
   * 🔧 FIX: 타이핑 완료 감지 로직 - animationPhase 의존성 제거로 race condition 방지
   */
  useEffect(() => {
    if (animationPhase === AnimationPhase.TYPING && currentIndex >= currentPhrase.text.length) {
      // 타이핑 완료 → 대기 단계로 전환
      setAnimationPhase(AnimationPhase.PAUSED);
    }
  }, [animationPhase, currentIndex, currentPhrase.text.length]);

  /**
   * 🔧 FIX: PAUSED 상태에서 CLEARING으로 전환하는 별도 useEffect
   * animationPhase만 감시하여 race condition 방지
   */
  useEffect(() => {
    if (animationPhase === AnimationPhase.PAUSED) {
      const pauseTimer = setTimeout(() => {
        setAnimationPhase(AnimationPhase.CLEARING);
      }, pauseDuration);

      return () => clearTimeout(pauseTimer);
    }
  }, [animationPhase, pauseDuration]);

  /**
   * 🔧 FIX: 화면 클리어 및 다음 문구로 전환 로직 - 비동기 상태 업데이트로 수정
   */
  useEffect(() => {
    if (animationPhase === AnimationPhase.CLEARING) {
      // 비동기적으로 상태 업데이트를 순차적으로 실행
      const clearAndReset = async () => {
        // 1. 화면 클리어
        setDisplayedText('');
        setCurrentIndex(0);

        // 2. 다음 문구로 전환 (phrases가 안정적으로 참조됨)
        setCurrentPhraseIndex(prev => (prev + 1) % phrases.length);

        // 3. 짧은 지연 후 타이핑 재시작 (상태 업데이트 완료 대기)
        setTimeout(() => {
          setAnimationPhase(AnimationPhase.TYPING);
        }, 50);
      };

      clearAndReset();
    }
  }, [animationPhase, phrases]);

  // 타이핑 중일 때 커서 표시
  const showCursor = animationPhase === AnimationPhase.TYPING && currentIndex < currentPhrase.text.length;

  return (
    <Text>
      {currentPhrase.renderFunction(displayedText)}
      {showCursor && <Text style={[styles.terminalText, styles.typewriterCursor]}>_</Text>}
    </Text>
  );
};

interface TerminalHeaderProps {
  onAlarmPress?: () => void;
  onSettingsPress?: () => void;
  showShadow?: boolean;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  onAlarmPress,
  onSettingsPress,
  showShadow = false,
}) => {
  const statusBarHeight = Platform.OS === 'ios'
    ? (StatusBar.currentHeight || 47)
    : (StatusBar.currentHeight || 24);

  return (
    <View style={[
      styles.headerContainer,
      { paddingTop: statusBarHeight },
      showShadow && styles.headerContainerWithShadow
    ]}>
      <View style={styles.headerContentContainer}>
        <View style={styles.terminalHeader}>
          <AdvancedTypewriterCycle
            speed={80}
            startDelay={300}
            pauseDuration={1000}
          />
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onAlarmPress || (() => console.log('Alarm pressed'))}
          >
            <BellIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onSettingsPress || (() => console.log('Settings pressed'))}
          >
            <SettingsIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TerminalHeader;