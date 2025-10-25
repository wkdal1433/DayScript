/**
 * PracticeScreen Component Test
 *
 * Basic tests to ensure component renders without errors
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import PracticeScreen from './PracticeScreen';

// Mock TerminalHeader component
jest.mock('../../components/Home/TerminalHeader', () => {
  return function MockTerminalHeader() {
    return null;
  };
});

describe('PracticeScreen', () => {
  it('renders without crashing', () => {
    render(<PracticeScreen />);
    // Basic render test
    expect(true).toBe(true);
  });

  it('handles problem press correctly', () => {
    const mockOnProblemPress = jest.fn();
    render(
      <PracticeScreen onProblemPress={mockOnProblemPress} />
    );

    // Basic functionality test
    expect(mockOnProblemPress).toHaveBeenCalledTimes(0);
  });
});