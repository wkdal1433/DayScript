import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden', // Critical: Prevent border overflow
  },
  backgroundCircle: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  progressContainer: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: 9999, // Large value to ensure circular clipping
  },
  halfCircle: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    overflow: 'hidden',
  },
  leftHalf: {
    left: 0,
    borderTopLeftRadius: 9999,
    borderBottomLeftRadius: 9999,
  },
  rightHalf: {
    right: 0,
    borderTopRightRadius: 9999,
    borderBottomRightRadius: 9999,
  },
  progressBar: {
    backgroundColor: 'transparent',
  },
});