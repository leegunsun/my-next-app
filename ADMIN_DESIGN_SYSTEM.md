# Admin Posts Design System Documentation

> **표준화 기준**: `@app\admin\posts\` 페이지의 CSS 요소들을 기준으로 하여 `@components\admin\` 하위의 모든 컴포넌트가 이 디자인 시스템을 따라야 합니다.

## 📋 목차

1. [디자인 토큰](#디자인-토큰)
2. [레이아웃 시스템](#레이아웃-시스템)
3. [컴포넌트 규격](#컴포넌트-규격)
4. [애니메이션 패턴](#애니메이션-패턴)
5. [인터랙션 가이드라인](#인터랙션-가이드라인)
6. [사용 예시](#사용-예시)

---

## 🎨 디자인 토큰

### 색상 시스템 (Color System)

#### 기본 색상 (Primary Colors)
```css
--color-primary: rgb(90, 169, 255)          /* 메인 브랜드 색상 */
--color-primary-foreground: rgb(255, 255, 255)  /* 흰색 텍스트 */
--color-accent-blend: rgb(88, 195, 169)     /* 액션 버튼 색상 */
```

#### 배경 색상 (Background Colors)
```css
--color-background: rgb(255, 255, 255)               /* 기본 배경 */
--color-background-secondary: rgb(249, 250, 251)     /* 섹션 배경 */
--color-background-tertiary: rgb(243, 244, 246)      /* 카드 배경 */
--color-background-card: rgb(255, 255, 255)          /* 카드 내부 */
```

#### 텍스트 색상 (Text Colors)
```css
--color-foreground: rgb(17, 24, 39)           /* 기본 텍스트 */
--color-foreground-secondary: rgb(107, 114, 128)  /* 보조 텍스트 */
--color-foreground-muted: rgb(156, 163, 175)      /* 약한 텍스트 */
```

#### 상태 색상 (Status Colors)
```css
--color-accent-success: rgb(108, 210, 143)    /* 성공/게시됨 */
--color-accent-warning: rgb(245, 158, 11)     /* 경고/초안 */
--color-accent-error: rgb(239, 68, 68)        /* 오류/삭제 */
--color-accent-info: rgb(122, 180, 245)       /* 정보/미리보기 */
--color-accent-purple: rgb(196, 167, 245)     /* 기타 액센트 */
```

#### 경계선 색상 (Border Colors)
```css
--color-border: rgb(229, 231, 235)            /* 기본 경계선 */
--color-border-secondary: rgb(243, 244, 246)  /* 약한 경계선 */
--color-border-tertiary: rgb(209, 213, 219)   /* 강한 경계선 */
```

### 타이포그래피 (Typography)

#### 제목 스타일 (Heading Styles)
```css
/* 페이지 제목 (AdminHeader) */
.admin-title {
  font-size: 1.5rem; /* 24px */
  font-weight: 600;   /* semibold */
  background: linear-gradient(to right, var(--color-foreground), var(--color-foreground)/80%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (min-width: 768px) {
  .admin-title {
    font-size: 1.875rem; /* 30px */
  }
}

/* 섹션 제목 */
.section-title {
  font-size: 1.125rem; /* 18px */
  font-weight: 500;     /* medium */
  color: var(--color-foreground);
}

/* 카드 제목 */
.card-title {
  font-size: 1rem;     /* 16px */
  font-weight: 500;    /* medium */
  color: var(--color-foreground);
}
```

#### 본문 텍스트 (Body Text)
```css
/* 기본 설명 텍스트 */
.description-text {
  font-size: 0.875rem; /* 14px */
  color: var(--color-foreground-secondary);
  line-height: 1.5;
}

@media (min-width: 768px) {
  .description-text {
    font-size: 1rem; /* 16px */
  }
}

/* 메타 정보 텍스트 */
.meta-text {
  font-size: 0.75rem; /* 12px */
  color: var(--color-foreground-secondary);
  line-height: 1.4;
}
```

### 간격 시스템 (Spacing System)

#### 컨테이너 패딩 (Container Padding)
```css
.admin-container {
  padding: 1.5rem; /* 24px */
  max-width: 72rem; /* 1152px */
  margin: 0 auto;
}

@media (min-width: 1024px) {
  .admin-container {
    padding-left: 2rem;  /* 32px */
    padding-right: 2rem; /* 32px */
  }
}
```

#### 컴포넌트 간격 (Component Spacing)
```css
.section-spacing {
  margin-bottom: 2rem; /* 32px */
}

.card-spacing {
  margin-bottom: 1rem; /* 16px */
}

.element-spacing {
  gap: 1rem; /* 16px */
}

.tight-spacing {
  gap: 0.75rem; /* 12px */
}
```

### 그림자 시스템 (Shadow System)

```css
/* 기본 카드 그림자 */
.shadow-card {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

/* 호버 그림자 */
.shadow-hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* 강한 그림자 */
.shadow-elevated {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
```

---

## 📐 레이아웃 시스템

### 페이지 구조 (Page Structure)

#### 기본 페이지 레이아웃
```tsx
<div className="min-h-screen bg-background relative">
  {/* 배경 효과 */}
  <div className="absolute inset-0 hero-gradient-bg opacity-20 pointer-events-none" />
  
  {/* 헤더 영역 */}
  <AdminHeader 
    title="페이지 제목"
    description="페이지 설명"
  />

  {/* 메인 콘텐츠 */}
  <main className="relative z-10">
    <div className="container mx-auto px-6 lg:px-8">
      <div className="max-w-6xl mx-auto min-h-[calc(100vh-20rem)] flex flex-col">
        {/* 콘텐츠 영역 */}
      </div>
    </div>
  </main>
</div>
```

### 그리드 시스템 (Grid System)

#### 반응형 그리드
```css
/* 기본 그리드 */
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

### 플렉스 레이아웃 (Flexbox Layout)

#### 헤더 액션 영역
```css
.header-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
}

@media (min-width: 1024px) {
  .header-actions {
    flex-direction: row;
    align-items: center;
  }
}
```

---

## 🧩 컴포넌트 규격

### 1. 버튼 (Buttons)

#### 기본 액션 버튼
```tsx
// 주요 액션 버튼
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  className="bg-accent-blend text-primary-foreground hover:opacity-90 px-8 py-4 text-lg rounded-2xl font-medium transition-all shadow-lg flex items-center gap-3"
>
  <Icon size={20} />
  버튼 텍스트
</motion.button>

// 보조 액션 버튼
<motion.button
  whileHover={{ scale: 1.1, y: -2 }}
  whileTap={{ scale: 0.95 }}
  className="p-3 text-foreground-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all shadow-sm hover:shadow-md"
  title="툴팁 텍스트"
>
  <Icon size={16} />
</motion.button>
```

#### 버튼 크기 규격
```css
/* 대형 버튼 (주요 액션) */
.btn-large {
  padding: 1rem 2rem;    /* 16px 32px */
  font-size: 1.125rem;   /* 18px */
  border-radius: 1rem;   /* 16px */
}

/* 중간 버튼 (일반 액션) */
.btn-medium {
  padding: 0.75rem 1.5rem; /* 12px 24px */
  font-size: 1rem;         /* 16px */
  border-radius: 0.75rem;  /* 12px */
}

/* 소형 버튼 (아이콘) */
.btn-small {
  padding: 0.75rem;       /* 12px */
  border-radius: 0.75rem; /* 12px */
}
```

### 2. 카드 (Cards)

#### 기본 카드 구조
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: index * 0.05 }}
  className="card-interactive glass-effect border border-border/30 shadow-sm hover:shadow-lg backdrop-blur-md"
>
  {/* 카드 콘텐츠 */}
</motion.div>
```

#### 카드 스타일 유틸리티
```css
/* 상호작용 카드 */
.card-interactive {
  background: var(--color-background-card);
  border-radius: 1.5rem; /* 24px */
  padding: 1.5rem;       /* 24px */
  border: 1px solid rgb(229 231 235 / 0.3);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transition: box-shadow 0.2s;
}

.card-interactive:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* 글래스 효과 */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### 3. 입력 필드 (Input Fields)

#### 검색 입력 필드
```tsx
<motion.div 
  whileHover={{ scale: 1.02 }}
  className="relative flex-1 max-w-md"
>
  <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground-secondary z-10 pointer-events-none" />
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="게시물 검색..."
    className="w-full pl-12 pr-4 py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
  />
</motion.div>
```

#### 입력 필드 스타일
```css
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;           /* 12px 16px */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border: 1px solid rgb(229 231 235 / 0.5);
  border-radius: 1rem;             /* 16px */
  font-size: 0.875rem;             /* 14px */
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: rgb(90 169 255 / 0.3);
  box-shadow: 0 0 0 2px rgb(90 169 255 / 0.2);
}

/* 아이콘이 있는 입력 필드 */
.input-with-icon {
  padding-left: 3rem; /* 48px */
}
```

### 4. 선택 박스 (Select Box)

#### CustomSelect 컴포넌트 (표준)
**위치**: `@components/ui/select.tsx`

```tsx
import { CustomSelect, SelectOption } from '../../../components/ui/select'

// 옵션 정의 (아이콘 포함)
const statusOptions: SelectOption[] = [
  { id: 'all', name: '전체', value: 'all', icon: <FileText size={16} /> },
  { id: 'published', name: '게시됨', value: 'published', icon: <CheckCircle size={16} /> },
  { id: 'draft', name: '초안', value: 'draft', icon: <FileEdit size={16} /> }
]

// 색상 옵션 (색상 프리뷰 포함)
const colorOptions: SelectOption[] = [
  { 
    id: 'primary', 
    name: 'Primary (파란색)', 
    value: 'bg-primary', 
    icon: <div className="w-4 h-4 bg-primary rounded-full" />
  },
  { 
    id: 'success', 
    name: 'Success (초록색)', 
    value: 'bg-accent-success', 
    icon: <div className="w-4 h-4 bg-accent-success rounded-full" />
  }
]

// 사용법
<CustomSelect
  label="상태"                    // 선택적 라벨
  options={statusOptions}         // SelectOption[] 배열
  value={statusFilter}           // 현재 선택된 값
  onChange={(value) => setStatusFilter(value)}  // 변경 핸들러
  placeholder="상태 선택"         // 플레이스홀더
  className="min-w-[140px]"      // 추가 스타일링
  disabled={false}               // 비활성화 상태
/>
```

#### SelectOption 인터페이스
```tsx
interface SelectOption {
  id: string          // 고유 식별자
  name: string        // 표시될 텍스트
  value: string       // 실제 값
  icon?: React.ReactNode  // 선택적 아이콘 (Lucide 아이콘 또는 커스텀 요소)
}
```

#### 주요 기능
- **Glass Effect**: 반투명 배경과 블러 효과
- **애니메이션**: Framer Motion 기반 부드러운 전환
- **아이콘 지원**: Lucide 아이콘 및 커스텀 컴포넌트
- **키보드 내비게이션**: 화살표, Enter, Escape 키 지원
- **접근성**: 포커스 관리, ARIA 속성, 스크린 리더 지원
- **호버 효과**: 색상 변화와 백그라운드 하이라이트
- **선택 표시**: 체크마크로 현재 선택된 항목 표시

#### 스타일 시스템
```css
/* 트리거 버튼 */
.select-trigger {
  width: 100%;
  padding: 0.75rem;               /* 12px */
  background: glass-effect;        /* 글래스 효과 */
  border: 1px solid rgb(229 231 235 / 0.5);
  border-radius: 1rem;            /* 16px */
  font-size: 0.875rem;            /* 14px */
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.select-trigger:hover {
  scale: 1.02;                    /* 약간의 확대 */
  border-color: rgb(90 169 255 / 0.5);
  box-shadow: 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.select-trigger:focus {
  outline: none;
  border-color: rgb(90 169 255 / 0.5);
  box-shadow: 0 0 0 2px rgb(90 169 255 / 0.3);
  ring: 2px rgb(90 169 255 / 0.3);
}

/* 드롭다운 컨테이너 */
.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;             /* 8px */
  z-index: 9999;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgb(229 231 235 / 0.3);
  border-radius: 1rem;            /* 16px */
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  backdrop-filter: blur(4px);
  max-height: 15rem;              /* 240px */
  overflow-y: auto;
}

/* 옵션 아이템 */
.select-option {
  width: 100%;
  padding: 0.75rem;               /* 12px */
  text-align: left;
  font-size: 0.875rem;            /* 14px */
  border-radius: 0.75rem;         /* 12px */
  margin: 0.25rem;                /* 4px */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  transition: all 0.15s;
}

.select-option:hover {
  background: rgb(90 169 255 / 0.1);
  color: rgb(90 169 255);
}

.select-option.selected {
  background: rgb(90 169 255 / 0.2);
  color: rgb(90 169 255);
  font-weight: 500;
}
```

#### 사용 예시

**기본 사용법**:
```tsx
<CustomSelect
  options={statusOptions}
  value={currentStatus}
  onChange={setCurrentStatus}
  placeholder="상태를 선택하세요"
/>
```

**라벨 포함**:
```tsx
<CustomSelect
  label="게시 상태"
  options={statusOptions}
  value={currentStatus}
  onChange={setCurrentStatus}
  placeholder="상태 선택"
  className="min-w-[140px]"
/>
```

**색상 선택기**:
```tsx
<CustomSelect
  label="테마 색상"
  options={colorOptions}
  value={selectedColor}
  onChange={setSelectedColor}
  placeholder="색상 선택"
/>
```

#### ⚠️ 중요 사항
- **필수 컴포넌트**: 모든 admin 페이지에서 `CustomSelect` 사용 필수
- **HTML select 금지**: 기본 `<select>` 요소 사용 금지 (디자인 시스템 위반)
- **옵션 형식**: 반드시 `SelectOption[]` 인터페이스 준수
- **아이콘 권장**: 사용자 경험 향상을 위해 아이콘 포함 권장
- **접근성**: 키보드 내비게이션과 스크린 리더 지원 필수

### 5. 상태 배지 (Status Badges)

#### PostStatusBadge 컴포넌트
```tsx
// 게시됨 상태
<span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-success/20 text-accent-success rounded-full font-medium text-xs">
  <CheckCircle size={12} />
  게시됨
</span>

// 초안 상태
<span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-warning/20 text-accent-warning rounded-full font-medium text-xs">
  <Clock size={12} />
  초안
</span>
```

#### 배지 스타일 규격
```css
.badge-base {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;                   /* 4px */
  padding: 0.25rem 0.5rem;        /* 4px 8px */
  border-radius: 9999px;          /* full */
  font-weight: 500;               /* medium */
  font-size: 0.75rem;             /* 12px */
}

.badge-success {
  background: rgb(108 210 143 / 0.2);
  color: rgb(108, 210, 143);
}

.badge-warning {
  background: rgb(245 158 11 / 0.2);
  color: rgb(245, 158, 11);
}

.badge-error {
  background: rgb(239 68 68 / 0.2);
  color: rgb(239, 68, 68);
}

.badge-info {
  background: rgb(122 180 245 / 0.2);
  color: rgb(122, 180, 245);
}
```

### 6. 로딩 상태 (Loading States)

#### 스켈레톤 로더
```tsx
<div className="space-y-6">
  {[...Array(5)].map((_, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      className="animate-pulse glass-effect rounded-3xl h-24 border border-border/30"
    />
  ))}
</div>
```

#### 스피너 애니메이션
```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
/>
```

---

## 🎬 애니메이션 패턴

### Framer Motion 전환 효과

#### 페이지 진입 애니메이션
```tsx
// 헤더 애니메이션
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
>

// 콘텐츠 애니메이션
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
>

// 리스트 아이템 애니메이션
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: index * 0.05 }}
>
```

#### 호버 애니메이션
```tsx
// 버튼 호버
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
>

// 카드 호버
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>

// 아이콘 호버
<motion.button
  whileHover={{ scale: 1.1, y: -2 }}
  whileTap={{ scale: 0.95 }}
>
```

### CSS 애니메이션

#### 페이드 인 효과
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

#### 펄스 효과
```css
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
```

---

## 🖱️ 인터랙션 가이드라인

### 호버 상태 (Hover States)

#### 버튼 호버
- **확대**: `scale: 1.05`
- **상승**: `translateY: -2px`
- **불투명도**: `opacity: 0.9`
- **그림자**: shadow-sm → shadow-md

#### 카드 호버
- **상승**: `translateY: -4px`
- **확대**: `scale: 1.02`
- **그림자**: shadow-sm → shadow-lg

### 포커스 상태 (Focus States)

```css
.focus-ring {
  outline: none;
  box-shadow: 0 0 0 2px rgb(90 169 255 / 0.2);
  border-color: rgb(90 169 255 / 0.3);
}
```

### 액티브 상태 (Active States)

```css
.active-state {
  transform: scale(0.95);
  transition-duration: 0.1s;
}
```

### 전환 지속시간 (Transition Durations)

- **즉각적**: `100ms` - 클릭, 포커스
- **빠름**: `200ms` - 호버, 색상 변경
- **일반**: `300ms` - 레이아웃 변경
- **느림**: `600ms` - 페이지 전환

---

## 💻 사용 예시

### 1. 기본 페이지 구조

```tsx
export default function AdminExamplePage() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* 배경 효과 */}
      <div className="absolute inset-0 hero-gradient-bg opacity-20 pointer-events-none" />
      
      {/* 헤더 */}
      <AdminHeader 
        title="페이지 제목"
        description="페이지에 대한 설명을 작성합니다"
      />

      {/* 메인 콘텐츠 */}
      <main className="relative z-10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-20rem)] flex flex-col">
            
            {/* 액션 바 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8"
            >
              {/* 검색 및 필터 */}
              <div className="flex items-center gap-6 flex-1">
                <SearchInput />
                <CustomSelect />
              </div>
              
              {/* 빠른 액션 */}
              <QuickActions variant="compact" />
            </motion.div>

            {/* 콘텐츠 영역 */}
            <div className="space-y-4">
              {/* 콘텐츠 */}
            </div>
            
          </div>
        </div>
      </main>
    </div>
  )
}
```

### 2. 카드 리스트 컴포넌트

```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="card-interactive glass-effect border border-border/30 shadow-sm hover:shadow-lg backdrop-blur-md"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-medium truncate">{item.title}</h3>
          <PostStatusBadge status={item.status} />
        </div>
        
        <p className="text-foreground-secondary text-sm line-clamp-2 mb-3">
          {item.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-foreground-secondary">
          {/* 메타 정보 */}
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <ActionButton />
      </div>
    </div>
  </motion.div>
))}
```

### 3. 폼 컴포넌트

```tsx
<div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
  <form className="space-y-6">
    <div>
      <label className="block text-sm font-medium mb-2 text-foreground">
        제목
      </label>
      <input
        type="text"
        className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
        placeholder="제목을 입력하세요"
      />
    </div>
    
    <div>
      <CustomSelect
        label="상태"
        options={statusOptions}
        value={status}
        onChange={setStatus}
      />
    </div>
    
    <div className="flex gap-4 pt-6">
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="bg-accent-blend text-primary-foreground hover:opacity-90 px-8 py-3 rounded-2xl font-medium transition-all shadow-lg flex items-center gap-2"
      >
        <Save size={16} />
        저장
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        className="bg-background-secondary text-foreground hover:bg-background-tertiary px-8 py-3 rounded-2xl font-medium transition-all border border-border"
      >
        취소
      </motion.button>
    </div>
  </form>
</div>
```

---

## 📝 체크리스트

새로운 admin 컴포넌트를 만들 때 다음 항목들을 확인하세요:

### ✅ 디자인 일관성
- [ ] 색상 토큰 사용 (`--color-*`)
- [ ] 적절한 타이포그래피 적용
- [ ] 표준 간격 시스템 사용
- [ ] 그림자 시스템 준수

### ✅ 애니메이션
- [ ] Framer Motion 사용
- [ ] 진입 애니메이션 적용
- [ ] 호버/포커스 상태 정의
- [ ] 적절한 전환 지속시간 설정

### ✅ 인터랙션
- [ ] 키보드 접근성 지원
- [ ] 포커스 링 표시
- [ ] 로딩 상태 처리
- [ ] 오류 상태 처리

### ✅ 반응형 디자인
- [ ] 모바일 우선 접근법
- [ ] 브레이크포인트 준수
- [ ] 터치 친화적 크기
- [ ] 적절한 여백 조정

### ✅ 성능
- [ ] 불필요한 리렌더링 방지
- [ ] 애니메이션 최적화
- [ ] 이미지 최적화
- [ ] 코드 분할 고려

---

## 🔄 업데이트 이력

- **v1.0.0** (2024-01-16): 초기 디자인 시스템 문서 작성
- 향후 변경사항은 이 섹션에 기록됩니다.

---

> **참고**: 이 문서는 `@app\admin\posts\` 페이지를 기준으로 작성되었으며, 모든 admin 컴포넌트는 이 가이드라인을 따라야 합니다. 새로운 패턴이나 컴포넌트를 추가할 때는 이 문서를 업데이트해 주세요.