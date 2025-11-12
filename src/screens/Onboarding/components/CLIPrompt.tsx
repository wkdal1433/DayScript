import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { onboardingStyles } from '../Onboarding.styles';

interface CLIPromptProps {
  command: string;
  delay?: number;
}

export const CLIPrompt: React.FC<CLIPromptProps> = ({ command, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const cursorOpacity = new Animated.Value(1);

  useEffect(() => {
    // Typing animation
    const typeText = async () => {
      await new Promise(resolve => setTimeout(resolve, delay));

      for (let i = 0; i <= command.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setDisplayedText(command.substring(0, i));
      }
    };

    typeText();

    // Cursor blinking animation
    const blinkCursor = () => {
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => blinkCursor());
    };

    blinkCursor();
  }, [command, delay]);

  return (
    <View style={onboardingStyles.cliPrompt}>
      <Text style={onboardingStyles.cliPromptText}>
        $ {displayedText}
      </Text>
      {showCursor && (
        <Animated.View
          style={[
            onboardingStyles.cursor,
            { opacity: cursorOpacity }
          ]}
        />
      )}
    </View>
  );
};