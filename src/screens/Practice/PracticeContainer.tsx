import React, { useState } from 'react';
import Lv1OXProblemScreen from './Lv1OXProblemScreen';
import Lv2MultipleChoiceProblemScreen from './Lv2MultipleChoiceProblemScreen';
import Lv3FillInTheBlankProblemScreen from './Lv3FillInTheBlankProblemScreen';
import { Lv4DebuggingScreen } from './Advanced';
import GoalCompletionModal from '../../components/Modals/GoalCompletionModal';
import { PracticeContainerProps } from './PracticeContainer.types';

const PracticeContainer: React.FC<PracticeContainerProps> = ({
  navigation,
  route,
  problemType = 'OX', // Default to OX problems
}) => {
  const [showGoalModal, setShowGoalModal] = useState(false);

  const handleShowGoalModal = () => {
    setShowGoalModal(true);
  };

  const handleCloseGoalModal = () => {
    setShowGoalModal(false);
  };

  const handleGoHome = () => {
    setShowGoalModal(false);
    // Navigate to Home screen (simplified for now)
    if (navigation && navigation.navigate) {
      navigation.navigate('Home');
    }
  };

  const handleClose = () => {
    // Navigate back to previous screen
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleNext = () => {
    console.log('Moving to next problem');
  };

  const handleSessionComplete = () => {
    console.log('Session completed');
    // Optional: Could show different behavior before goal modal
  };

  const handleAnswerSelect = (answer: any) => {
    console.log('Answer selected:', answer);
  };

  const commonProps = {
    onAnswerSelect: handleAnswerSelect,
    onClose: handleClose,
    onNext: handleNext,
    onSessionComplete: handleSessionComplete,
    onShowGoalModal: handleShowGoalModal,
    timeRemaining: 30, // Default timer
  };

  // Debugging-specific props
  const debuggingProps = {
    onDebugComplete: (result: any) => {
      console.log('Debug completion result:', result);
    },
    onClose: handleClose,
    onNext: handleNext,
    onSessionComplete: handleSessionComplete,
    onShowGoalModal: handleShowGoalModal,
    timeRemaining: 600, // 10 minutes for debugging problems
  };

  const renderProblemScreen = () => {
    switch (problemType) {
      case 'OX':
        return <Lv1OXProblemScreen {...commonProps} />;
      case 'MULTIPLE_CHOICE':
        return <Lv2MultipleChoiceProblemScreen {...commonProps} />;
      case 'FILL_IN_BLANK':
        return <Lv3FillInTheBlankProblemScreen {...commonProps} />;
      case 'DEBUGGING':
        return <Lv4DebuggingScreen {...debuggingProps} />;
      default:
        return <Lv1OXProblemScreen {...commonProps} />;
    }
  };

  return (
    <>
      {renderProblemScreen()}

      <GoalCompletionModal
        visible={showGoalModal}
        onRequestClose={handleCloseGoalModal}
        onGoHome={handleGoHome}
        experiencePoints={50}
        animationDuration={1400}
      />
    </>
  );
};

export default PracticeContainer;