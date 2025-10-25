import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Quest } from '../../types/common';
import { styles } from '../../screens/Home/Home.styles';

interface TodayQuestsProps {
  quests: Quest[];
  onQuestToggle: (questId: string) => void;
}

const TodayQuests: React.FC<TodayQuestsProps> = ({
  quests,
  onQuestToggle,
}) => {
  return (
    <View style={[styles.card, styles.todayQuestCard]}>
      <Text style={styles.sectionTitle}>오늘의 목표</Text>
      {quests.map((quest, index) => (
        <TouchableOpacity
          key={quest.id}
          style={[
            styles.questItem,
            { marginBottom: index === quests.length - 1 ? 0 : 10 } // Figma 정확 간격
          ]}
          onPress={() => onQuestToggle(quest.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, quest.completed && styles.checkboxCompleted]}>
            {quest.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.questText, { flex: 1 }]}>{quest.title}</Text>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: quest.progress ? `${quest.progress}%` : '0%',
                  backgroundColor: quest.completed ? '#F2BED1' : '#8B5CF6' // Figma gradient colors
                }
              ]}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TodayQuests;