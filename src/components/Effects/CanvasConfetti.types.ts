import { Animated } from 'react-native';

export interface CanvasConfettiProps {
  visible: boolean;
  onComplete?: () => void;
  particleCount?: number;
  duration?: number;
  explosionPoints?: number;
}

export interface ConfettiParticle {
  id: string;
  color: string;
  shape: string;
  size: number;

  // Animation values
  translateX: Animated.Value;
  translateY: Animated.Value;
  rotate: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;

  // Physics properties
  velocityX: number;
  velocityY: number;
  gravity: number;
  rotationSpeed: number;
}