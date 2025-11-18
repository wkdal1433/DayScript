// Enhanced NextButton with Refined Gradient Transitions
// These are optional improvements to the already excellent implementation

const enhancedGradientStyles = StyleSheet.create({
  // Add a fourth micro-layer for even smoother transition
  primaryButtonMicroTransition: {
    position: 'absolute',
    top: 0.5,
    left: 0.5,
    right: 0.5,
    bottom: 0.5,
    backgroundColor: 'rgba(252, 231, 243, 0.8)', // Very light outer edge
    borderRadius: 23.5,
    shadowColor: '#FCE7F3',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 35, // Extended outer glow
    elevation: 8,
  },

  // Refined transition layer with better opacity gradient
  primaryButtonTransitionRefined: {
    position: 'absolute',
    top: 1.5,
    left: 1.5,
    right: 1.5,
    bottom: 1.5,
    backgroundColor: 'rgba(242, 190, 209, 0.6)', // Increased opacity for smoother transition
    borderRadius: 22.5,
    shadowColor: 'rgba(242, 190, 209, 0.8)', // Gradient color shadow
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 25,
    elevation: 12,
    // Add subtle inner shadow effect
    borderWidth: 0.5,
    borderColor: 'rgba(252, 231, 243, 0.4)',
  },

  // Enhanced inner layer with better center definition
  primaryButtonInnerRefined: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    backgroundColor: '#F2BED1',
    borderRadius: 21,
    shadowColor: '#F2BED1',
    shadowOpacity: 0.9, // Increased for stronger center definition
    shadowOffset: { width: 0, height: 1 }, // Subtle directional shadow
    shadowRadius: 20, // Slightly larger for better center glow
    elevation: 18,
    // Enhanced border for crisp center definition
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Light highlight on center
  },

  // Ultra-enhanced text for maximum readability
  primaryTextUltraEnhanced: {
    color: '#FFFFFF',
    zIndex: 15,
    // Multi-layer text shadow for maximum clarity
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    // Additional properties for enhanced readability
    fontWeight: '800', // Bolder font
    letterSpacing: 0.3, // Slight letter spacing for clarity
  },
});

// Optional: Add subtle animation for even better visual appeal
const buttonAnimationStyle = {
  // Subtle scale animation on press
  transform: [{ scale: 0.98 }], // Slightly compressed when pressed
};