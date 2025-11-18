import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Lv1OXProblemScreen from './Lv1OXProblemScreen';
import { Lv1OXProblemScreenProps } from './Lv1OXProblemScreen.types';

// Mock Animated
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      Value: jest.fn(() => ({
        interpolate: jest.fn(() => '50%'),
      })),
      timing: jest.fn(() => ({
        start: jest.fn(),
      })),
    },
  };
});

describe('Lv1OXProblemScreen', () => {
  const mockProps: Lv1OXProblemScreenProps = {
    onAnswerSelect: jest.fn(),
    onClose: jest.fn(),
    onNext: jest.fn(),
    currentProblem: 1,
    totalProblems: 10,
    timeRemaining: 30,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders problem screen correctly', () => {
    const { getByText } = render(<Lv1OXProblemScreen {...mockProps} />);

    // Check if problem counter is displayed
    expect(getByText('문제 1 / 10')).toBeTruthy();

    // Check if problem content is displayed
    expect(getByText('Python에서 리스트는')).toBeTruthy();
    expect(getByText('가변(mutable) 자료형이다.')).toBeTruthy();

    // Check if category badge is displayed
    expect(getByText('Python 기초')).toBeTruthy();

    // Check if timer is displayed
    expect(getByText('30s')).toBeTruthy();

    // Check if hint is displayed
    expect(getByText('힌트')).toBeTruthy();

    // Check if progress percentage is displayed
    expect(getByText('10%')).toBeTruthy();
  });

  it('calls onClose when back button is pressed', () => {
    const { getByText } = render(<Lv1OXProblemScreen {...mockProps} />);

    const backButton = getByText('←');
    fireEvent.press(backButton);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onAnswerSelect when answer button is pressed', () => {
    const { getByText } = render(<Lv1OXProblemScreen {...mockProps} />);

    // Find and press the O button (circle symbol)
    const oButton = getByText('○');
    fireEvent.press(oButton);

    expect(mockProps.onAnswerSelect).toHaveBeenCalledWith('O');
  });

  it('calls onAnswerSelect when X button is pressed', () => {
    const { getByText } = render(<Lv1OXProblemScreen {...mockProps} />);

    // Find and press the X button (cross symbol)
    const xButton = getByText('✕');
    fireEvent.press(xButton);

    expect(mockProps.onAnswerSelect).toHaveBeenCalledWith('X');
  });

  it('disables answer buttons after selection', () => {
    const { getByText } = render(<Lv1OXProblemScreen {...mockProps} />);

    const oButton = getByText('○');
    const xButton = getByText('✕');

    // Press O button
    fireEvent.press(oButton);

    // Try to press X button, should not trigger onAnswerSelect again
    fireEvent.press(xButton);

    // Should only be called once (for O button)
    expect(mockProps.onAnswerSelect).toHaveBeenCalledTimes(1);
    expect(mockProps.onAnswerSelect).toHaveBeenCalledWith('O');
  });

  it('shows result overlay after answer selection', async () => {
    const { getByText, queryByText } = render(<Lv1OXProblemScreen {...mockProps} />);

    // Initially, result overlay should not be visible
    expect(queryByText('정답!')).toBeFalsy();
    expect(queryByText('오답!')).toBeFalsy();

    // Press an answer button
    const oButton = getByText('○');
    fireEvent.press(oButton);

    // Result overlay should appear
    await waitFor(() => {
      expect(getByText('정답!')).toBeTruthy(); // Since the correct answer is 'O'
    });
  });

  it('calls onNext after showing result for 2 seconds', async () => {
    jest.useFakeTimers();

    const { getByText } = render(<Lv1OXProblemScreen {...mockProps} />);

    const oButton = getByText('○');
    fireEvent.press(oButton);

    // Fast-forward time by 2 seconds
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockProps.onNext).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });

  it('formats timer correctly', () => {
    const propsWithDifferentTime: Lv1OXProblemScreenProps = {
      ...mockProps,
      timeRemaining: 15,
    };

    const { getByText } = render(<Lv1OXProblemScreen {...propsWithDifferentTime} />);

    expect(getByText('15s')).toBeTruthy();
  });

  it('calculates progress percentage correctly', () => {
    const propsWithDifferentProgress: Lv1OXProblemScreenProps = {
      ...mockProps,
      currentProblem: 3,
      totalProblems: 10,
    };

    const { getByText } = render(<Lv1OXProblemScreen {...propsWithDifferentProgress} />);

    // 3/10 = 30%
    expect(getByText('30%')).toBeTruthy();
    expect(getByText('문제 3 / 10')).toBeTruthy();
  });

  it('renders with default props when not provided', () => {
    const { getByText } = render(<Lv1OXProblemScreen />);

    // Check default values
    expect(getByText('문제 1 / 10')).toBeTruthy();
    expect(getByText('30s')).toBeTruthy();
    expect(getByText('10%')).toBeTruthy();
  });
});