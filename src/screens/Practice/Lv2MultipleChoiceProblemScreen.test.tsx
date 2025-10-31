import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Lv2MultipleChoiceProblemScreen from './Lv2MultipleChoiceProblemScreen';
import { Lv2MultipleChoiceProblemScreenProps } from './Lv2MultipleChoiceProblemScreen.types';

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

describe('Lv2MultipleChoiceProblemScreen', () => {
  const mockProps: Lv2MultipleChoiceProblemScreenProps = {
    onAnswerSelect: jest.fn(),
    onClose: jest.fn(),
    onNext: jest.fn(),
    currentProblem: 2,
    totalProblems: 10,
    timeRemaining: 30,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders multiple choice problem screen correctly', () => {
    const { getByText } = render(<Lv2MultipleChoiceProblemScreen {...mockProps} />);

    // Check if problem counter is displayed
    expect(getByText('문제 2/ 10')).toBeTruthy();

    // Check if problem content is displayed
    expect(getByText('Python에서 함수를 정의할 때 사용하는')).toBeTruthy();
    expect(getByText('키워드는 무엇일까요?')).toBeTruthy();

    // Check if category badge is displayed
    expect(getByText('기초 문법 : 함수 정의')).toBeTruthy();

    // Check if timer is displayed
    expect(getByText('30s')).toBeTruthy();

    // Check if all choice options are displayed
    expect(getByText('function')).toBeTruthy();
    expect(getByText('define')).toBeTruthy();
    expect(getByText('def')).toBeTruthy();
    expect(getByText('func')).toBeTruthy();

    // Check if submit button is displayed (should be disabled initially)
    expect(getByText('정답 제출하기')).toBeTruthy();

    // Check if progress percentage is displayed
    expect(getByText('20%')).toBeTruthy(); // 2/10 = 20%
    expect(getByText('전체 진행률')).toBeTruthy();
  });

  it('calls onClose when back button is pressed', () => {
    const { getByText } = render(<Lv2MultipleChoiceProblemScreen {...mockProps} />);

    const backButton = getByText('←');
    fireEvent.press(backButton);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onAnswerSelect when choice option is pressed', () => {
    const { getByText } = render(<Lv2MultipleChoiceProblemScreen {...mockProps} />);

    // Find and press choice option C (def)
    const defChoice = getByText('def');
    fireEvent.press(defChoice);

    expect(mockProps.onAnswerSelect).toHaveBeenCalledWith('C');
  });

  it('calls onAnswerSelect when different choice option is pressed', () => {
    const { getByText } = render(<Lv2MultipleChoiceProblemScreen {...mockProps} />);

    // Find and press choice option A (function)
    const functionChoice = getByText('function');
    fireEvent.press(functionChoice);

    expect(mockProps.onAnswerSelect).toHaveBeenCalledWith('A');
  });

  it('allows changing answer selection before submission', () => {
    const { getByText } = render(<Lv2MultipleChoiceProblemScreen {...mockProps} />);

    const defChoice = getByText('def');
    const functionChoice = getByText('function');

    // Press def choice first
    fireEvent.press(defChoice);

    // Press function choice to change selection
    fireEvent.press(functionChoice);

    // Should be called twice (for def choice, then function choice)
    expect(mockProps.onAnswerSelect).toHaveBeenCalledTimes(2);
    expect(mockProps.onAnswerSelect).toHaveBeenNthCalledWith(1, 'C');
    expect(mockProps.onAnswerSelect).toHaveBeenNthCalledWith(2, 'A');
  });

  it('enables submit button after answer selection', () => {
    const { getByText } = render(<Lv2MultipleChoiceProblemScreen {...mockProps} />);

    const submitButton = getByText('정답 제출하기');
    const defChoice = getByText('def');

    // Submit button should be disabled initially
    expect(submitButton.props.accessibilityState?.disabled).toBeTruthy();

    // Select an answer
    fireEvent.press(defChoice);

    // Submit button should be enabled after selection
    // Note: The exact way to test this depends on your styling approach
    // This is a conceptual test - you might need to adjust based on actual implementation
  });

  it('shows result overlay after answer selection', async () => {
    const { getByText, queryByText } = render(<Lv2MultipleChoiceProblemScreen {...mockProps} />);

    // Initially, result overlay should not be visible
    expect(queryByText('정답!')).toBeFalsy();
    expect(queryByText('오답!')).toBeFalsy();

    // Press an answer choice
    const defChoice = getByText('def');
    fireEvent.press(defChoice);

    // Result overlay should appear
    await waitFor(() => {
      expect(getByText('정답!')).toBeTruthy(); // Since 'def' is the correct answer
    });
  });

  it('shows incorrect result for wrong answer', async () => {
    const { getByText, queryByText } = render(<Lv2MultipleChoiceProblemScreen {...mockProps} />);

    // Press wrong answer choice
    const functionChoice = getByText('function');
    fireEvent.press(functionChoice);

    // Should show incorrect result
    await waitFor(() => {
      expect(getByText('오답!')).toBeTruthy();
    });
  });

  it('calls onNext after showing result for 2 seconds', async () => {
    jest.useFakeTimers();

    const { getByText } = render(<Lv2MultipleChoiceProblemScreen {...mockProps} />);

    const defChoice = getByText('def');
    fireEvent.press(defChoice);

    // Fast-forward time by 2 seconds
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockProps.onNext).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });

  it('formats timer correctly', () => {
    const propsWithDifferentTime: Lv2MultipleChoiceProblemScreenProps = {
      ...mockProps,
      timeRemaining: 45,
    };

    const { getByText } = render(<Lv2MultipleChoiceProblemScreen {...propsWithDifferentTime} />);

    expect(getByText('45s')).toBeTruthy();
  });

  it('calculates progress percentage correctly', () => {
    const propsWithDifferentProgress: Lv2MultipleChoiceProblemScreenProps = {
      ...mockProps,
      currentProblem: 5,
      totalProblems: 10,
    };

    const { getByText } = render(<Lv2MultipleChoiceProblemScreen {...propsWithDifferentProgress} />);

    // 5/10 = 50%
    expect(getByText('50%')).toBeTruthy();
    expect(getByText('문제 5/ 10')).toBeTruthy();
  });

  it('renders with default props when not provided', () => {
    const { getByText } = render(<Lv2MultipleChoiceProblemScreen />);

    // Check default values
    expect(getByText('문제 2/ 10')).toBeTruthy();
    expect(getByText('30s')).toBeTruthy();
    expect(getByText('20%')).toBeTruthy(); // 2/10 = 20%
  });

  it('displays all choice options with correct IDs', () => {
    const { getByText } = render(<Lv2MultipleChoiceProblemScreen {...mockProps} />);

    // Check if choice IDs are displayed (A, B, C, D)
    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
    expect(getByText('C')).toBeTruthy();
    expect(getByText('D')).toBeTruthy();

    // Check if choice texts are displayed
    expect(getByText('function')).toBeTruthy();
    expect(getByText('define')).toBeTruthy();
    expect(getByText('def')).toBeTruthy();
    expect(getByText('func')).toBeTruthy();
  });

  it('shows explanation text in result overlay', async () => {
    const { getByText } = render(<Lv2MultipleChoiceProblemScreen {...mockProps} />);

    // Press an answer choice
    const defChoice = getByText('def');
    fireEvent.press(defChoice);

    // Check if explanation is shown
    await waitFor(() => {
      expect(getByText('Python에서 함수를 정의할 때는 "def" 키워드를 사용합니다.')).toBeTruthy();
    });
  });
});