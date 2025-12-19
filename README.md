# 🎴 포켓몬 카드 도감 (Pokemon Card Dex)

포켓몬을 수집하고 탐색하는 인터랙티브 카드 도감 웹 애플리케이션입니다.  
마우스 호버 시 3D 회전 효과와 광택 효과가 적용된 카드 UI를 제공합니다.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)

## ✨ 주요 기능

### 🎯 핵심 기능
- **포켓몬 카드 컬렉션**: 1세대 포켓몬들을 카드 형태로 탐색
- **실시간 검색**: 이름(한글/영문) 또는 ID로 포켓몬 검색
- **페이지네이션**: 효율적인 페이지 단위 탐색 (페이지당 20개)
- **상세 정보 모달**: 카드 클릭 시 포켓몬의 상세 정보 확인

### 🎨 카드 특수 효과

#### 1. **3D 회전 효과 (Tilting)**
- 마우스를 카드 위에 올리면 카드가 마우스 방향을 따라 기울어집니다
- `perspective`와 `rotateX`, `rotateY`를 활용한 3D 변환 효과

#### 2. **광택 효과 (Glow)**
- 마우스 커서를 따라다니는 반짝이는 광택 효과

#### 3. **타입별 색상 그라디언트**
- 포켓몬 타입에 따른 배경색 적용
- 단일 타입: 해당 타입의 색상
- 복수 타입: 두 타입 색상의 대각선 그라디언트

## 🛠️ 기술 스택

### Frontend
- **React 19.2.0** - UI 라이브러리
- **TypeScript 5.9.3** - 타입 안정성
- **Vite 7.2.4** - 빠른 개발 서버 및 빌드 도구

### 스타일링
- **Tailwind CSS 4.1.18** - 유틸리티 우선 CSS 프레임워크
- 커스텀 애니메이션 및 반응형 디자인

### 상태 관리 & 데이터 페칭
- **TanStack Query (React Query) 5.90.12** - 서버 상태 관리
- **Axios 1.13.2** - HTTP 클라이언트

### UI 라이브러리
- **overlay-kit 1.8.6** - 모달 관리

### 데이터 소스
- **PokeAPI** - 포켓몬 데이터 제공

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── card.tsx        # 포켓몬 카드 (3D 효과 포함)
│   ├── PokemonDetailModal.tsx  # 상세 정보 모달
│   ├── poketDexTemplate.tsx    # 메인 템플릿
│   ├── SearchBar.tsx           # 검색바
│   ├── Pagination.tsx          # 페이지네이션
│   └── ImageWithFallback.tsx   # 이미지 로딩 처리
├── hooks/              # 커스텀 훅
│   └── useGetPoket.tsx # 포켓몬 데이터 페칭
├── types/              # TypeScript 타입 정의
│   └── pokemon.ts      # 포켓몬 관련 타입
├── constants/          # 상수 정의
│   └── pokemon.ts      # 타입 색상, 한글명 등
└── assets/             # 정적 파일
    └── json/           # 로컬 데이터
```

## 🎯 카드 효과 상세 설명

### 3D 회전 효과 구현

```typescript
// 마우스 위치에 따라 카드 회전 각도 계산
const rotateY = ((x - centerX) / centerX) * -10;  // 좌우 기울기
const rotateX = ((y - centerY) / centerY) * 10;   // 상하 기울기

// 3D 변환 적용
card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
```

### 광택 효과 구현

```typescript
// 마우스 위치를 백분율로 변환
const percentX = (x / rect.width) * 100;
const percentY = (y / rect.height) * 100;

// radial-gradient로 동적 광택 효과 생성
glowRef.current.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.4), transparent 60%)`;
```

- `requestAnimationFrame`을 사용하여 성능 최적화
- 마우스 이벤트 최적화로 부드러운 애니메이션 제공

## 🎨 디자인 특징

- **반응형 레이아웃**: 화면 크기에 따라 자동으로 그리드 열 개수 조정
  - 모바일: 1열
  - 태블릿: 2-3열
  - 데스크톱: 4-5열
- **타입별 색상 시스템**: 포켓몬 타입에 맞는 색상 매핑
- **부드러운 애니메이션**: 모든 상호작용에 전환 효과 적용

## 📝 라이선스

이 프로젝트는 개인 학습 목적으로 제작되었습니다.

---

**포켓몬 데이터 출처**: [PokeAPI](https://pokeapi.co/)
