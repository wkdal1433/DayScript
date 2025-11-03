import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  AccessibilityInfo,
} from 'react-native';
import { styles } from './Lv5ModeSelectModal.styles';

// 모듈 타입 정의
export type Lv5Module = 'vibe_coding' | 'code_review';

// Props 인터페이스
export interface Lv5ModeSelectModalProps {
  isVisible: boolean;
  onClose: () => void;
  onModuleSelect: (module: Lv5Module) => void;
}

// 모듈 정보 인터페이스
interface ModuleInfo {
  id: Lv5Module;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  features: string[];
  difficulty: string;
  estimatedTime: string;
}

/**
 * LV5 Challenger Mode 모듈 선택 모달
 *
 * 디자인 요구사항:
 * - 반투명 블러 배경 오버레이
 * - 카드형 모듈 선택 인터페이스
 * - 선택 상태 시각적 피드백
 * - 접근성 지원
 */
const Lv5ModeSelectModal: React.FC<Lv5ModeSelectModalProps> = ({
  isVisible,
  onClose,
  onModuleSelect,
}) => {
  const [selectedModule, setSelectedModule] = useState<Lv5Module | null>(null);

  // 모듈 정보 정의
  const modules: ModuleInfo[] = [
    {
      id: 'vibe_coding',
      title: 'VIBE CODING',
      subtitle: 'AI 프롬프팅 실전 모듈',
      description: 'AI와의 대화를 통해 실제 프로젝트 수준의 코드를 생성하고 최적화하는 실전 능력을 테스트합니다.',
      icon: '🤖',
      features: [
        'AI 프롬프트 엔지니어링',
        '실시간 코드 생성 및 검토',
        '토큰 효율성 최적화',
        '프로젝트 맥락 이해도 평가',
      ],
      difficulty: 'Expert',
      estimatedTime: '30분',
    },
    {
      id: 'code_review',
      title: 'CODE REVIEW & PR',
      subtitle: '코드 검토 및 PR 관리',
      description: '실제 개발 환경과 유사한 Pull Request 시나리오에서 코드 품질을 평가하고 검토하는 전문성을 검증합니다.',
      icon: '📋',
      features: [
        '실전 PR 검토 시뮬레이션',
        '코드 품질 분석',
        '보안 취약점 탐지',
        '팀 협업 커뮤니케이션',
      ],
      difficulty: 'Expert',
      estimatedTime: '25분',
    },
  ];

  // 모듈 선택 핸들러
  const handleModuleSelect = (moduleId: Lv5Module) => {
    console.log('🎯 Module card pressed:', moduleId);
    setSelectedModule(moduleId);
    AccessibilityInfo.announceForAccessibility(`${modules.find(m => m.id === moduleId)?.title} 모듈이 선택되었습니다`);
  };

  // 확인 버튼 핸들러
  const handleConfirm = () => {
    console.log('🚀 Confirm button pressed, selectedModule:', selectedModule);
    if (selectedModule) {
      console.log('✅ Calling onModuleSelect with:', selectedModule);

      // 모듈 선택 성공 알림
      AccessibilityInfo.announceForAccessibility(`${modules.find(m => m.id === selectedModule)?.title} 모듈로 이동합니다`);

      // 부모 컴포넌트로 선택된 모듈 전달 (부모에서 모달 닫기 및 내비게이션 처리)
      onModuleSelect(selectedModule);
    } else {
      console.log('❌ No module selected');
    }
  };

  // 모듈 카드 렌더링
  const renderModuleCard = (module: ModuleInfo) => {
    const isSelected = selectedModule === module.id;

    return (
      <TouchableOpacity
        key={module.id}
        style={[
          styles.moduleCard,
          isSelected && styles.moduleCardSelected,
        ]}
        onPress={() => handleModuleSelect(module.id)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`${module.title} 모듈 선택`}
        accessibilityHint={module.description}
        accessibilityState={{ selected: isSelected }}
      >
        {/* 선택 표시 */}
        {isSelected && (
          <View style={styles.selectionIndicator}>
            <Text style={styles.selectionCheckmark}>✓</Text>
          </View>
        )}

        {/* 모듈 아이콘 */}
        <View style={styles.moduleIconContainer}>
          <Text style={styles.moduleIcon}>{module.icon}</Text>
        </View>

        {/* 모듈 정보 */}
        <View style={styles.moduleInfo}>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
          <Text style={styles.moduleDescription}>{module.description}</Text>

          {/* 기능 목록 */}
          <View style={styles.featuresList}>
            {module.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* 메타 정보 */}
          <View style={styles.moduleMetaInfo}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>난이도:</Text>
              <Text style={styles.metaValue}>{module.difficulty}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>예상 시간:</Text>
              <Text style={styles.metaValue}>{module.estimatedTime}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      {/* 블러 배경 오버레이 */}
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          {/* 모달 카드 */}
          <View style={styles.modalCard}>
            {/* 헤더 영역 - 고정 */}
            <View style={styles.header}>
              <Text style={styles.title}>🏆 LV5 CHALLENGER MODE</Text>
              <Text style={styles.subtitle}>도전할 모듈을 선택하세요.</Text>

              {/* 닫기 버튼 */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="모달 닫기"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 모듈 선택 영역 */}
            <View style={styles.moduleSelection}>
              <Text style={styles.selectionTitle}>전문가 모드 모듈</Text>
              <View style={styles.moduleCards}>
                {modules.map(renderModuleCard)}
              </View>
            </View>

            {/* 하단 버튼 영역 */}
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !selectedModule && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={!selectedModule}
                accessibilityRole="button"
                accessibilityLabel="선택 완료"
                accessibilityHint={selectedModule ? "선택한 모듈로 이동합니다" : "모듈을 먼저 선택해주세요"}
              >
                <Text style={[
                  styles.confirmButtonText,
                  !selectedModule && styles.confirmButtonTextDisabled,
                ]}>
                  선택 완료
                </Text>
              </TouchableOpacity>

              <Text style={styles.helpText}>
                각 모듈은 실전 개발 상황을 시뮬레이션합니다
              </Text>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default Lv5ModeSelectModal;