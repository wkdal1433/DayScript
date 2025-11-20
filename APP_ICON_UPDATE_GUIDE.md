# DayScript 앱 아이콘 업데이트 가이드

## 개요

DayScript 앱의 브랜딩 통합을 위해 공식 로고를 앱 아이콘으로 설정하는 방법입니다.

## 소스 파일

- **PNG 로고**: `src/assets/logo/Dayscript_logo_nukki.png` *(누끼 딴 투명 배경)*
- **React Native 컴포넌트**: `src/components/common/ui/AppLogo.tsx` *(PNG 기반)*

## 필요한 작업

### 1. PNG 파일 리사이즈

기존 `Dayscript_logo_nukki.png` 파일을 다양한 해상도로 리사이즈해야 합니다:

**Android 아이콘 크기:**
- `mipmap-hdpi`: 72x72px
- `mipmap-mdpi`: 48x48px
- `mipmap-xhdpi`: 96x96px
- `mipmap-xxhdpi`: 144x144px
- `mipmap-xxxhdpi`: 192x192px

**iOS 아이콘 크기:**
- 20x20px (1x), 40x40px (2x), 60x60px (3x)
- 29x29px (1x), 58x58px (2x), 87x87px (3x)
- 40x40px (1x), 80x80px (2x), 120x120px (3x)
- 60x60px (1x), 120x120px (2x), 180x180px (3x)
- 76x76px (1x), 152x152px (2x), 228x228px (3x)
- 83.5x83.5px (2x)
- 1024x1024px (1x) - App Store용

### 2. Android 아이콘 교체

다음 경로의 `ic_launcher.png` 파일들을 교체:

```
android/app/src/main/res/mipmap-hdpi/ic_launcher.png
android/app/src/main/res/mipmap-mdpi/ic_launcher.png
android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

### 3. iOS 아이콘 교체

iOS 프로젝트의 AppIcon.appiconset 내 파일들을 교체:

```
ios/DayScript/Images.xcassets/AppIcon.appiconset/
```

`Contents.json` 파일도 업데이트하여 올바른 파일명과 크기가 매핑되도록 합니다.

### 4. 권장 도구

**PNG 리사이즈:**
- Adobe Photoshop
- GIMP (무료)
- ImageMagick (명령줄 도구)
- Sharp (Node.js)
- 온라인 도구: TinyPNG, Squoosh, ResizeImage

**아이콘 생성 도구:**
- App Icon Generator (온라인) - PNG 업로드 지원
- Icon Set Creator (Mac)
- Asset Catalog Creator (iOS)

### 5. 적용 후 확인사항

1. **빌드 테스트**: Android/iOS 빌드가 정상적으로 완료되는지 확인
2. **시각적 확인**: 다양한 디바이스에서 아이콘이 올바르게 표시되는지 확인
3. **App Store 가이드라인**: Apple/Google의 아이콘 가이드라인 준수 여부 확인

## 주의사항

1. **투명 배경**: 앱 아이콘은 투명 배경을 지원하지 않으므로 적절한 배경색 추가
2. **둥근 모서리**: iOS는 자동으로 둥근 모서리를 적용하므로 별도 작업 불필요
3. **적응형 아이콘**: Android는 다양한 모양의 아이콘을 지원하므로 고려
4. **고해상도**: 모든 해상도에서 선명하게 표시되도록 벡터 기반 변환 권장

## 완료된 작업

- ✅ PNG 로고 파일 확인 (`src/assets/logo/Dayscript_logo_nukki.png`)
- ✅ React Native AppLogo 컴포넌트를 PNG 기반으로 업데이트
- ✅ 온보딩 Step4 화면에 PNG 로고 통합 (z-index 999로 상위 배치)
- ✅ 로그인 화면에 PNG 로고 통합
- ✅ UI 컴포넌트 익스포트 추가
- ✅ SVG 렌더링 문제 해결을 위한 PNG 전환 완료

## 다음 단계

1. PNG 파일을 다양한 해상도로 리사이즈 (위 크기 목록 참조)
2. Android 아이콘 파일 교체
3. iOS 아이콘 파일 교체 및 Contents.json 업데이트
4. 빌드 테스트 및 시각적 확인

## PNG 사용 장점

- **렌더링 안정성**: SVG 렌더링 문제 해결
- **성능 향상**: 이미지 로딩 속도 개선
- **투명 배경**: 누끼 딴 PNG로 다양한 배경에 적용 가능
- **호환성**: 모든 React Native 환경에서 일관된 표시