# DifficultySelectionModal Component

## Overview

The DifficultySelectionModal is a React Native modal component that displays a difficulty selection interface based on the Figma design. It allows users to choose from different learning levels (입문, 중급, 고급, 챌린지) with detailed information about each level.

## Features

### 🎨 UI Components
- **Modal Header**: Title "레벨별 학습 모드" with close button
- **Language Badge**: Displays selected programming language (Python, Java, etc.)
- **Progress Dots**: Visual indicator of current step
- **Instructions**: Guidance text for level selection
- **Difficulty Cards**: Interactive cards for each difficulty level
- **Bottom Action**: "풀기" button or "뒤로가기" based on selection state

### 📱 Difficulty Levels

1. **입문 (Beginner)** 🌱
   - Python 기초 문법
   - O/X 퀴즈와 객관식 문제
   - 20문제, 15분, 쉬움

2. **중급 (Intermediate)** 🚀
   - 제어문과 함수
   - 빈칸 채우기 퀴즈
   - 25문제, 20분, 보통

3. **고급 (Advanced)** 💎
   - 객체지향과 고급 문법
   - 디버깅 모드
   - 30문제, 25분, 어려움

4. **챌린지 (Challenge)** 🏆
   - 실전 문제 도전
   - 코드 리뷰와 라이브 코딩
   - 15문제, 10분, 최고난이도

## Usage

### Props Interface

```typescript
interface DifficultySelectionModalProps {
  isVisible: boolean;           // Modal visibility state
  onClose: () => void;          // Close modal callback
  onSelectLevel: (level: DifficultyLevel) => void; // Level selection callback
  selectedLanguage?: string;    // Current programming language
}
```

### Basic Implementation

```tsx
import { DifficultySelectionModal, DifficultyLevel } from '../components/Modals';

function HomeScreen() {
  const [isDifficultyModalVisible, setIsDifficultyModalVisible] = useState(false);

  const handleModalClose = () => {
    setIsDifficultyModalVisible(false);
  };

  const handleLevelSelect = (level: DifficultyLevel) => {
    console.log('Selected level:', level);
    setIsDifficultyModalVisible(false);
    // Navigate to problem screen with selected level
  };

  return (
    <>
      {/* Your screen content */}

      <DifficultySelectionModal
        isVisible={isDifficultyModalVisible}
        onClose={handleModalClose}
        onSelectLevel={handleLevelSelect}
        selectedLanguage="Python"
      />
    </>
  );
}
```

### HomeScreen Integration

The modal is connected to the HomeScreen's "학습 바로가기" shortcut button:

```tsx
const handleActionPress = (actionType: string) => {
  if (actionType === 'shortcut') {
    setIsDifficultyModalVisible(true);
  }
};
```

## Styling

### Figma Design Adherence
- **Colors**: Exact color matching from Figma design
- **Typography**: Inter font family with proper weights
- **Spacing**: Precise measurements from Figma layout
- **Gradients**: Linear gradients for icons and progress elements
- **Borders**: Rounded corners and border colors matching design

### Key Style Features
- Modal overlay with dimming effect
- Smooth card selection animations
- Progress bar animations
- Gradient backgrounds for level icons
- Responsive layout with proper spacing

## File Structure

```
src/components/Modals/
├── DifficultySelectionModal.tsx     # Main component
├── DifficultySelectionModal.styles.ts # Styling
├── index.ts                         # Exports
└── README.md                        # Documentation
```

## Integration Steps Completed

1. ✅ **Component Creation**: Modal component with full functionality
2. ✅ **Styling Implementation**: Figma-accurate styling with gradients and animations
3. ✅ **HomeScreen Integration**: Connected to shortcut button
4. ✅ **State Management**: Modal visibility and level selection handling
5. ✅ **Type Safety**: Full TypeScript interfaces and type checking

## Navigation Flow

1. User clicks "학습 바로가기" button in HomeScreen
2. DifficultySelectionModal opens with slide animation
3. User browses and selects desired difficulty level
4. User clicks "풀기" button to confirm selection
5. Modal closes and triggers onSelectLevel callback
6. Parent component handles navigation to problem screen

## Technical Implementation

### Modal Architecture
- Uses React Native's `Modal` component with transparent overlay
- Pressable overlay for backdrop dismissal
- Smooth slide-up animation
- Proper event propagation handling

### State Management
- Local state for selected difficulty level
- Parent component controls modal visibility
- Callback-based communication with parent

### Performance Optimizations
- Efficient re-rendering with proper key props
- Optimized scroll view with bounce disabled
- Minimal state updates for smooth animations

## Future Enhancements

- [ ] Add haptic feedback for level selection
- [ ] Implement progress persistence
- [ ] Add level completion tracking
- [ ] Dynamic difficulty based on user performance
- [ ] Multi-language support for level descriptions