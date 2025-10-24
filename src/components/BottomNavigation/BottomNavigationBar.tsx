import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../../constants';
import { styles } from './BottomNavigationBar.styles';

interface BottomNavigationBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  const getNavIcon = (tab: string, isActive: boolean) => {
    const iconColor = isActive ? COLORS.white : '#F2BED1';

    switch (tab) {
      case 'Home':
        return (
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M9 22V12H15V22"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'Practice':
        return (
          <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <Path
              d="M13.5 15.75C14.7426 15.75 15.75 14.7426 15.75 13.5C15.75 12.2574 14.7426 11.25 13.5 11.25C12.2574 11.25 11.25 12.2574 11.25 13.5C11.25 14.7426 12.2574 15.75 13.5 15.75Z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M4.5 6.75C5.74264 6.75 6.75 5.74264 6.75 4.5C6.75 3.25736 5.74264 2.25 4.5 2.25C3.25736 2.25 2.25 3.25736 2.25 4.5C2.25 5.74264 3.25736 6.75 4.5 6.75Z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M9.75 4.5H12C12.3978 4.5 12.7794 4.65804 13.0607 4.93934C13.342 5.22064 13.5 5.60218 13.5 6V11.25"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M4.5 6.75V15.75"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'Community':
        return (
          <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <Path
              d="M15.75 11.25C15.75 11.6478 15.592 12.0294 15.3107 12.3107C15.0294 12.592 14.6478 12.75 14.25 12.75H5.25L2.25 15.75V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H14.25C14.6478 2.25 15.0294 2.40804 15.3107 2.68934C15.592 2.97064 15.75 3.35218 15.75 3.75V11.25Z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'Profile':
        return (
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      default:
        return (
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M9 22V12H15V22"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
    }
  };

  return (
    <View style={styles.bottomNavigation}>
      {['Home', 'Practice', 'Community', 'Profile'].map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[
              styles.navButton,
              isActive && styles.navButtonActive,
            ]}
            onPress={() => onTabPress(tab)}
            activeOpacity={0.7}
          >
            {getNavIcon(tab, isActive)}
            <Text
              style={[
                styles.navLabel,
                isActive && styles.navLabelActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavigationBar;