import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { CanvasConfettiProps, ConfettiParticle } from './CanvasConfetti.types';
import { styles } from './CanvasConfetti.styles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Design guide color palette
const CONFETTI_COLORS = ['#FFD93D', '#FF6B6B', '#6BCB77', '#4D96FF'];
const CONFETTI_SHAPES = ['●', '■', '▲', '★'];

const CanvasConfetti: React.FC<CanvasConfettiProps> = ({
  visible,
  onComplete,
  particleCount = 50,
  duration = 2000,
  explosionPoints = 3,
}) => {
  const particles = useRef<ConfettiParticle[]>([]);
  const animationRefs = useRef<Animated.CompositeAnimation[]>([]);

  // Generate random particle properties
  const createParticle = (index: number, explosionIndex: number): ConfettiParticle => {
    const explosionX = (screenWidth / (explosionPoints + 1)) * (explosionIndex + 1);
    const explosionY = screenHeight * 0.3; // Start from upper third

    return {
      id: `${explosionIndex}-${index}`,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
      size: Math.random() * 8 + 12, // 12-20px

      // Position animations
      translateX: new Animated.Value(explosionX),
      translateY: new Animated.Value(explosionY),

      // Physics animations
      rotate: new Animated.Value(0),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),

      // Physics properties
      velocityX: (Math.random() - 0.5) * 400, // Horizontal spread
      velocityY: Math.random() * -300 - 100, // Upward initial velocity
      gravity: 800, // Downward acceleration
      rotationSpeed: (Math.random() - 0.5) * 720, // Rotation degrees per second
    };
  };

  // Physics-based animation using requestAnimationFrame concept
  const createParticleAnimation = (particle: ConfettiParticle, delay: number) => {
    const { translateX, translateY, rotate, scale, opacity } = particle;
    const animationDuration = duration;

    return Animated.parallel([
      // Horizontal movement with wind effect
      Animated.timing(translateX, {
        toValue: particle.velocityX,
        duration: animationDuration,
        useNativeDriver: true,
      }),

      // Vertical movement with gravity (parabolic)
      Animated.timing(translateY, {
        toValue: screenHeight + 100, // Fall below screen
        duration: animationDuration,
        useNativeDriver: true,
      }),

      // Continuous rotation
      Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: Math.abs(particle.rotationSpeed) > 0 ? 1000 : 1000,
          useNativeDriver: true,
        })
      ),

      // Scale variation for depth effect
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.3,
          duration: animationDuration * 0.3,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: animationDuration * 0.7,
          useNativeDriver: true,
        }),
      ]),

      // Fade out
      Animated.sequence([
        Animated.delay(animationDuration * 0.6),
        Animated.timing(opacity, {
          toValue: 0,
          duration: animationDuration * 0.4,
          useNativeDriver: true,
        }),
      ]),
    ]);
  };

  // Initialize and start confetti explosion
  useEffect(() => {
    if (visible) {
      // Clear previous particles
      particles.current = [];
      animationRefs.current.forEach(anim => anim.stop());
      animationRefs.current = [];

      // Generate particles for multiple explosion points
      for (let explosionIndex = 0; explosionIndex < explosionPoints; explosionIndex++) {
        const particlesPerExplosion = Math.floor(particleCount / explosionPoints);

        for (let i = 0; i < particlesPerExplosion; i++) {
          const particle = createParticle(i, explosionIndex);
          particles.current.push(particle);

          // Staggered timing for natural explosion effect
          const delay = explosionIndex * 150 + (i * 20);
          const animation = Animated.sequence([
            Animated.delay(delay),
            createParticleAnimation(particle, delay),
          ]);

          animationRefs.current.push(animation);
          animation.start();
        }
      }

      // Complete callback after total duration
      const totalDuration = duration + (explosionPoints * 150);
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, totalDuration);
    }

    return () => {
      // Cleanup animations
      animationRefs.current.forEach(anim => anim.stop());
    };
  }, [visible, particleCount, duration, explosionPoints, onComplete]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.current.map((particle) => {
        const rotateValue = particle.rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${particle.rotationSpeed}deg`],
        });

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: particle.translateX },
                  { translateY: particle.translateY },
                  { rotate: rotateValue },
                  { scale: particle.scale },
                ],
                opacity: particle.opacity,
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.particleText,
                {
                  color: particle.color,
                  fontSize: particle.size,
                },
              ]}
            >
              {particle.shape}
            </Animated.Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

export default CanvasConfetti;