/**
 * AppLogo Component
 *
 * DayScript 앱의 공식 로고 PNG 컴포넌트
 * 온보딩 화면 및 기타 브랜딩 요소에 사용
 * SVG 렌더링 문제 해결을 위해 PNG로 전환
 */

import React from 'react';
import { View, Image, ImageStyle, ViewStyle } from 'react-native';

export interface AppLogoProps {
  size?: number;
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 100,
  width,
  height,
  style,
}) => {
  const logoWidth = width || size;
  const logoHeight = height || size;

  const containerStyle: ViewStyle = {
    width: logoWidth,
    height: logoHeight,
    justifyContent: 'center',
    alignItems: 'center',
    ...style,
  };

  const imageStyle: ImageStyle = {
    width: logoWidth,
    height: logoHeight,
    resizeMode: 'contain',
  };

  return (
    <View style={containerStyle}>
      <Image
        source={require('../../../assets/logo/Dayscript_logo_nukki.png')}
        style={imageStyle}
        accessible={true}
        accessibilityLabel="DayScript 로고"
      />
    </View>
  );
};

export default AppLogo;