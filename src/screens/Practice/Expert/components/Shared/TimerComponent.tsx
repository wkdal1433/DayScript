import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  AccessibilityInfo,
} from 'react-native';
import { TimerComponentProps } from '../../Lv5ExpertModeScreen.types';
import { styles } from '../../Lv5ExpertModeScreen.styles';

/**
 * TimerComponent
 *
 * Displays session timer with accessibility support and warning states.
 *
 * SOLID Principles:
 * - Single Responsibility: Handles only timer display and countdown logic
 * - Open/Closed: Format and warning behaviors can be extended without modification
 * - Interface Segregation: Focused timer-specific props interface
 */
const TimerComponent: React.FC<TimerComponentProps> = ({
  initialTime,
  isRunning,
  onTimeUp,
  onTimeUpdate,
  showWarningAt = 300, // 5 minutes default
  format = 'mm:ss',
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isWarningShown, setIsWarningShown] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAnnouncementRef = useRef<number>(0);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;

          // Call update callback
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }

          // Check for warning threshold
          if (newTime <= showWarningAt && !isWarningShown) {
            setIsWarningShown(true);
            announceTimeWarning(newTime);
          }

          // Check for periodic announcements (every minute during warning period)
          if (newTime <= showWarningAt && newTime % 60 === 0 && newTime !== lastAnnouncementRef.current) {
            lastAnnouncementRef.current = newTime;
            announceTimeRemaining(newTime);
          }

          // Time up
          if (newTime <= 0) {
            onTimeUp();
            return 0;
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, onTimeUpdate, onTimeUp, showWarningAt, isWarningShown]);

  // Reset timer when initialTime changes
  useEffect(() => {
    setTimeRemaining(initialTime);
    setIsWarningShown(false);
    lastAnnouncementRef.current = 0;
  }, [initialTime]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    switch (format) {
      case 'hh:mm:ss':
        return `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      case 'mm:ss':
      default:
        const totalMinutes = Math.floor(seconds / 60);
        return `${totalMinutes.toString().padStart(2, '0')}:${remainingSeconds
          .toString()
          .padStart(2, '0')}`;
    }
  };

  // Accessibility announcements
  const announceTimeWarning = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const message = minutes > 0
      ? `Warning: ${minutes} minute${minutes !== 1 ? 's' : ''} remaining`
      : `Warning: Less than 1 minute remaining`;

    AccessibilityInfo.announceForAccessibility(message);
  };

  const announceTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const message = minutes > 0
      ? `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`
      : 'Less than 1 minute remaining';

    AccessibilityInfo.announceForAccessibility(message);
  };

  // Get display style based on time remaining
  const getTimerStyle = () => {
    const baseStyle = styles.timerContainer;

    if (timeRemaining <= showWarningAt) {
      return [baseStyle, styles.timerWarning];
    }

    return baseStyle;
  };

  const getTimerTextStyle = () => {
    const baseStyle = styles.timerText;

    if (timeRemaining <= showWarningAt) {
      return [baseStyle, styles.timerWarningText];
    }

    return baseStyle;
  };

  // Get accessibility label
  const getAccessibilityLabel = (): string => {
    const formattedTime = formatTime(timeRemaining);
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    let label = 'Session timer: ';

    if (minutes > 0) {
      label += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
      if (seconds > 0) {
        label += ` and ${seconds} second${seconds !== 1 ? 's' : ''}`;
      }
    } else {
      label += `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }

    label += ' remaining';

    if (timeRemaining <= showWarningAt) {
      label += '. Warning: Time is running low';
    }

    if (!isRunning) {
      label += '. Timer is paused';
    }

    return label;
  };

  return (
    <View
      style={getTimerStyle()}
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint="Session time remaining"
      accessibilityLiveRegion="polite"
    >
      <Text
        style={getTimerTextStyle()}
        accessibilityLabel={getAccessibilityLabel()}
      >
        {formatTime(timeRemaining)}
      </Text>

      {/* Pause indicator */}
      {!isRunning && timeRemaining > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#F59E0B',
          }}
          accessibilityElementsHidden={true}
        />
      )}

      {/* Warning pulse animation indicator */}
      {timeRemaining <= showWarningAt && isRunning && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: '#EF4444',
            opacity: 0.6,
          }}
          accessibilityElementsHidden={true}
        />
      )}
    </View>
  );
};

export default TimerComponent;