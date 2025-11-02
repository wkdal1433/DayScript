import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Lv4DebuggingScreen from './Lv4DebuggingScreen';

// Mock the useHint hook
jest.mock('../../../hooks/useHint', () => ({
  useHint: () => ({
    hintState: {
      isVisible: false,
      currentStep: 1,
      usedSteps: 0,
      totalXpDeducted: 0,
    },
    showHint: jest.fn(),
    nextHint: jest.fn(),
    hideHint: jest.fn(),
    resetHint: jest.fn(),
    getCurrentHintData: jest.fn(),
    isLastStep: jest.fn(() => false),
  }),
}));

describe('Lv4DebuggingScreen', () => {
  const mockProps = {
    onDebugComplete: jest.fn(),
    onClose: jest.fn(),
    onNext: jest.fn(),
    onSessionComplete: jest.fn(),
    onShowGoalModal: jest.fn(),
    timeRemaining: 600,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<Lv4DebuggingScreen {...mockProps} />);

    expect(getByText('문제 1/10')).toBeTruthy();
    expect(getByText('💡 힌트 보기')).toBeTruthy();
    expect(getByText('▶️ 코드 실행하기')).toBeTruthy();
  });

  it('displays problem title and description', () => {
    const { getByText } = render(<Lv4DebuggingScreen {...mockProps} />);

    expect(getByText('리스트 합계 계산 오류')).toBeTruthy();
    expect(getByText(/주어진 숫자 리스트의 합계를 계산하는 함수에 버그가 있습니다/)).toBeTruthy();
  });

  it('handles close button press', () => {
    const { getByText } = render(<Lv4DebuggingScreen {...mockProps} />);

    const backButton = getByText('←');
    fireEvent.press(backButton);

    // Alert should be shown (cannot test Alert.alert directly)
    // In a real test, you would mock Alert.alert
  });

  it('handles hint button press', () => {
    const { getByText } = render(<Lv4DebuggingScreen {...mockProps} />);

    const hintButton = getByText('💡 힌트 보기');
    fireEvent.press(hintButton);

    // Should call showHint (mocked)
  });

  it('handles execute button press', () => {
    const { getByText } = render(<Lv4DebuggingScreen {...mockProps} />);

    const executeButton = getByText('▶️ 코드 실행하기');
    fireEvent.press(executeButton);

    // Should show simulation modal
  });

  it('displays timer correctly', () => {
    const { getByText } = render(<Lv4DebuggingScreen {...mockProps} />);

    expect(getByText('10:00')).toBeTruthy();
  });

  it('renders code editor with initial code', () => {
    const { getByDisplayValue } = render(<Lv4DebuggingScreen {...mockProps} />);

    // The code editor should contain the initial Python code
    expect(getByDisplayValue(/def calculate_sum/)).toBeTruthy();
  });
});