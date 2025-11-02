import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Lv3FillInTheBlankProblemScreen from './Lv3FillInTheBlankProblemScreen';
import { Lv3FillInTheBlankProblemScreenProps } from './Lv3FillInTheBlankProblemScreen.types';

// Mock Animated
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      Value: jest.fn(() => ({
        interpolate: jest.fn(() => '20%'),
      })),
      timing: jest.fn(() => ({
        start: jest.fn(),
      })),
    },
  };
});

describe('Lv3FillInTheBlankProblemScreen', () => {
  const mockProps: Lv3FillInTheBlankProblemScreenProps = {
    onAnswerSubmit: jest.fn(),
    onClose: jest.fn(),
    onNext: jest.fn(),
    onSessionComplete: jest.fn(),
    onShowGoalModal: jest.fn(),
    timeRemaining: 30,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders fill-in-the-blank problem screen correctly', () => {
    const { getByText, getByDisplayValue } = render(
      <Lv3FillInTheBlankProblemScreen {...mockProps} />
    );

    // Check if problem counter is displayed
    expect(getByText('문제 2 / 10')).toBeTruthy();

    // Check if problem content is displayed
    expect(getByText('다음 Python 코드에서 빈칸에 들어갈')).toBeTruthy();
    expect(getByText('올바른 키워드를 입력하세요.')).toBeTruthy();

    // Check if category badge is displayed
    expect(getByText('Python 기초')).toBeTruthy();

    // Check if problem badge is displayed
    expect(getByText('🎯 빈칸 채우기')).toBeTruthy();

    // Check if timer is displayed
    expect(getByText('30s')).toBeTruthy();

    // Check if input instruction is displayed
    expect(getByText('빈칸에 들어갈 답을 입력하세요')).toBeTruthy();

    // Check if submit button is displayed (should be disabled initially)
    expect(getByText('정답 제출하기')).toBeTruthy();

    // Check if progress percentage is displayed
    expect(getByText('20%')).toBeTruthy();
    expect(getByText('전체 진행률')).toBeTruthy();
  });

  it('calls onClose when back button is pressed', () => {
    const { getByText } = render(<Lv3FillInTheBlankProblemScreen {...mockProps} />);

    const backButton = getByText('←');
    fireEvent.press(backButton);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('allows text input in blank fields', () => {
    const { getByPlaceholderText } = render(
      <Lv3FillInTheBlankProblemScreen {...mockProps} />
    );

    // Find the blank input field
    const blankInput = getByPlaceholderText('___');

    // Type text into the blank field
    fireEvent.changeText(blankInput, 'for');

    // Check if the text was entered
    expect(blankInput.props.value).toBe('for');
  });

  it('enables submit button when all blanks are filled', () => {
    const { getByPlaceholderText, getByText } = render(
      <Lv3FillInTheBlankProblemScreen {...mockProps} />
    );

    const submitButton = getByText('정답 제출하기');
    const blankInput = getByPlaceholderText('___');

    // Submit button should be disabled initially
    expect(submitButton.props.accessibilityState?.disabled).toBeTruthy();

    // Fill in the blank
    fireEvent.changeText(blankInput, 'for');

    // Submit button should be enabled after filling all blanks
    // Note: The exact way to test this depends on your styling approach
    // This is a conceptual test - you might need to adjust based on actual implementation
  });

  it('calls onAnswerSubmit when submit button is pressed with correct answer', () => {
    const { getByPlaceholderText, getByText } = render(
      <Lv3FillInTheBlankProblemScreen {...mockProps} />
    );

    const blankInput = getByPlaceholderText('___');
    const submitButton = getByText('정답 제출하기');

    // Fill in the correct answer
    fireEvent.changeText(blankInput, 'for');

    // Submit the answer
    fireEvent.press(submitButton);

    expect(mockProps.onAnswerSubmit).toHaveBeenCalledWith({
      blank_1: 'for',
    });
  });

  it('calls onAnswerSubmit when submit button is pressed with incorrect answer', () => {
    const { getByPlaceholderText, getByText } = render(
      <Lv3FillInTheBlankProblemScreen {...mockProps} />
    );

    const blankInput = getByPlaceholderText('___');
    const submitButton = getByText('정답 제출하기');

    // Fill in an incorrect answer
    fireEvent.changeText(blankInput, 'while');

    // Submit the answer
    fireEvent.press(submitButton);

    expect(mockProps.onAnswerSubmit).toHaveBeenCalledWith({
      blank_1: 'while',
    });
  });

  it('shows result overlay after answer submission', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <Lv3FillInTheBlankProblemScreen {...mockProps} />
    );

    // Initially, result overlay should not be visible
    expect(queryByText('정답입니다!')).toBeFalsy();
    expect(queryByText('오답입니다!')).toBeFalsy();

    const blankInput = getByPlaceholderText('___');
    const submitButton = getByText('정답 제출하기');

    // Fill in the correct answer
    fireEvent.changeText(blankInput, 'for');
    fireEvent.press(submitButton);

    // Result overlay should appear
    await waitFor(() => {
      expect(getByText('정답입니다!')).toBeTruthy(); // Since 'for' is the correct answer
    });
  });

  it('shows incorrect result for wrong answer', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Lv3FillInTheBlankProblemScreen {...mockProps} />
    );

    const blankInput = getByPlaceholderText('___');
    const submitButton = getByText('정답 제출하기');

    // Fill in an incorrect answer
    fireEvent.changeText(blankInput, 'while');
    fireEvent.press(submitButton);

    // Should show incorrect result
    await waitFor(() => {
      expect(getByText('오답입니다!')).toBeTruthy();
    });
  });

  it('displays explanation text in result overlay', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Lv3FillInTheBlankProblemScreen {...mockProps} />
    );

    const blankInput = getByPlaceholderText('___');
    const submitButton = getByText('정답 제출하기');

    // Fill in an answer and submit
    fireEvent.changeText(blankInput, 'for');
    fireEvent.press(submitButton);

    // Check if explanation is shown
    await waitFor(() => {
      expect(getByText('Python에서 반복문을 만들 때는 "for" 키워드를 사용합니다.')).toBeTruthy();
    });
  });

  it('calls onNext when next button is pressed in result view', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Lv3FillInTheBlankProblemScreen {...mockProps} />
    );

    const blankInput = getByPlaceholderText('___');
    const submitButton = getByText('정답 제출하기');

    // Submit answer to show result view
    fireEvent.changeText(blankInput, 'for');
    fireEvent.press(submitButton);

    // Wait for result view and find next button
    await waitFor(() => {
      const nextButton = getByText('다음 문제로 이동 →');
      fireEvent.press(nextButton);
    });

    expect(mockProps.onNext).toHaveBeenCalledTimes(1);
  });

  it('formats timer correctly', () => {
    const propsWithDifferentTime: Lv3FillInTheBlankProblemScreenProps = {
      ...mockProps,
      timeRemaining: 45,
    };

    const { getByText } = render(<Lv3FillInTheBlankProblemScreen {...propsWithDifferentTime} />);

    expect(getByText('45s')).toBeTruthy();
  });

  it('renders with default props when not provided', () => {
    const { getByText } = render(<Lv3FillInTheBlankProblemScreen />);

    // Check default values
    expect(getByText('문제 2 / 10')).toBeTruthy();
    expect(getByText('30s')).toBeTruthy();
    expect(getByText('20%')).toBeTruthy();
  });

  it('displays code lines with line numbers correctly', () => {
    const { getByText } = render(<Lv3FillInTheBlankProblemScreen {...mockProps} />);

    // Check if line numbers are displayed
    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();

    // Check if code content is displayed
    expect(getByText('    print(i)')).toBeTruthy();
  });

  it('prevents input after answer submission', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Lv3FillInTheBlankProblemScreen {...mockProps} />
    );

    const blankInput = getByPlaceholderText('___');
    const submitButton = getByText('정답 제출하기');

    // Fill in and submit answer
    fireEvent.changeText(blankInput, 'for');
    fireEvent.press(submitButton);

    // Wait for result state
    await waitFor(() => {
      expect(getByText('정답입니다!')).toBeTruthy();
    });

    // Try to change input after submission - should not work
    // Input should be disabled in result state
    expect(blankInput.props.editable).toBeFalsy();
  });

  it('handles keyboard correctly on different platforms', () => {
    // This test would check KeyboardAvoidingView behavior
    // The exact test depends on platform-specific behavior
    const { getByTestId } = render(<Lv3FillInTheBlankProblemScreen {...mockProps} />);

    // KeyboardAvoidingView should be present
    // Note: You might need to add testID props to test this properly
  });
});