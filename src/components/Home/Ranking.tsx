import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { UserRanking } from '../../types/common';
import { styles } from '../../screens/Home/Home.styles';

interface RankingProps {
  topUsers: UserRanking[];
  onMorePress?: () => void;
}

const Ranking: React.FC<RankingProps> = ({
  topUsers,
  onMorePress,
}) => {
  return (
    <View style={[styles.card, styles.rankingCard]}>
      <Text style={styles.rankingTitle}>🏆 이번 주 당신은 Top 12% 🚀</Text>
      <View style={styles.rankingList}>
        {topUsers.map((user) => (
          <View key={user.rank} style={styles.rankingItem}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankNumber}>{user.rank}</Text>
            </View>
            <View style={styles.rankInfo}>
              <Text style={styles.rankName}>{user.name}</Text>
              <Text style={styles.rankScore}>{user.score.toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={onMorePress || (() => console.log('More pressed'))}
      >
        <Text style={styles.moreButtonText}>더보기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Ranking;