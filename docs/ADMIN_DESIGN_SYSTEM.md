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
--color-border: rgb(229, 231, 235)           /* 기본 경계선 */
--color-border-secondary: rgb(209, 213, 219)  /* 강조 경계선 */
--color-border-accent: rgb(90, 169, 255)      /* 브랜드 경계선 */
```

### 타이포그래피 (Typography)

#### 폰트 패밀리 (Font Family)
```css
--font-family-default: system-ui, -apple-system, sans-serif
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace
```

#### 폰트 크기 (Font Sizes)
```css
--text-3xl: 1.875rem      /* 30px - 메인 제목 */
--text-2xl: 1.5rem        /* 24px - 서브 제목 */
--text-xl: 1.25rem        /* 20px - 섹션 제목 */
--text-lg: 1.125rem       /* 18px - 카드 제목 */
--text-base: 1rem         /* 16px - 기본 텍스트 */
--text-sm: 0.875rem       /* 14px - 보조 텍스트 */
--text-xs: 0.75rem        /* 12px - 라벨/메타 */
```

#### 폰트 두께 (Font Weights)
```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### 간격 시스템 (Spacing System)

#### 표준 간격 (Standard Spacing)
```css
--space-0_5: 0.125rem    /* 2px */
--space-1: 0.25rem       /* 4px */
--space-2: 0.5rem        /* 8px */
--space-3: 0.75rem       /* 12px */
--space-4: 1rem          /* 16px */
--space-6: 1.5rem        /* 24px */
--space-8: 2rem          /* 32px */
--space-12: 3rem         /* 48px */
--space-16: 4rem         /* 64px */
```

#### 컴포넌트별 간격 (Component Spacing)
```css
--spacing-section: 2rem              /* 섹션 간 간격 */
--spacing-card: 1.5rem              /* 카드 내부 패딩 */
--spacing-element: 1rem             /* 엘리먼트 간 간격 */
--spacing-compact: 0.5rem           /* 밀집 간격 */
```

### 그림자 시스템 (Shadow System)

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-card: var(--shadow-md)        /* 카드 기본 그림자 */
--shadow-card-hover: var(--shadow-lg)  /* 카드 호버 그림자 */
```

### 테두리 반경 (Border Radius)

```css
--radius-sm: 0.375rem    /* 6px */
--radius-md: 0.5rem      /* 8px */
--radius-lg: 0.75rem     /* 12px */
--radius-xl: 1rem        /* 16px */
--radius-full: 9999px    /* 완전한 원형 */
--radius-card: var(--radius-lg)    /* 카드 기본 반경 */
--radius-button: var(--radius-md)  /* 버튼 기본 반경 */
```

---

## 📐 레이아웃 시스템

### 그리드 시스템 (Grid System)

#### 메인 컨테이너
```css
.admin-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .admin-container {
    padding: 0 var(--space-6);
  }
}

@media (min-width: 1024px) {
  .admin-container {
    padding: 0 var(--space-8);
  }
}
```

#### 카드 그리드
```css
.admin-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

@media (min-width: 768px) {
  .admin-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

@media (min-width: 1024px) {
  .admin-grid {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
}
```

### 헤더 레이아웃 (Header Layout)

```css
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6) 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-section);
}

.admin-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-foreground);
  margin: 0;
}

.admin-actions {
  display: flex;
  gap: var(--space-4);
  align-items: center;
}
```

### 내비게이션 레이아웃 (Navigation Layout)

```css
.admin-nav {
  display: flex;
  gap: var(--space-6);
  align-items: center;
  padding: var(--space-4) 0;
}

.admin-nav-item {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-foreground-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.admin-nav-item:hover,
.admin-nav-item.active {
  color: var(--color-primary);
}
```

---

## 🧩 컴포넌트 규격

### 카드 컴포넌트 (Card Component)

#### 기본 카드
```css
.admin-card {
  background: var(--color-background-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-card);
  transition: all 0.2s ease;
}

.admin-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
```

#### 카드 헤더
```css
.admin-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

.admin-card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-foreground);
  margin: 0;
}
```

#### 카드 본문
```css
.admin-card-content {
  color: var(--color-foreground-secondary);
  line-height: 1.6;
}

.admin-card-content p {
  margin: 0 0 var(--space-3) 0;
}

.admin-card-content p:last-child {
  margin-bottom: 0;
}
```

#### 카드 푸터
```css
.admin-card-footer {
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
```

### 버튼 컴포넌트 (Button Component)

#### 기본 버튼 스타일
```css
.admin-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: 1;
  border: none;
  border-radius: var(--radius-button);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
}

.admin-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

#### 버튼 변형 (Button Variants)

**Primary Button**
```css
.admin-button--primary {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}

.admin-button--primary:hover:not(:disabled) {
  background: rgb(69, 146, 233); /* 더 어두운 Primary */
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(90, 169, 255, 0.3);
}
```

**Success Button**
```css
.admin-button--success {
  background: var(--color-accent-success);
  color: white;
}

.admin-button--success:hover:not(:disabled) {
  background: rgb(88, 190, 123);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(108, 210, 143, 0.3);
}
```

**Danger Button**
```css
.admin-button--danger {
  background: var(--color-accent-error);
  color: white;
}

.admin-button--danger:hover:not(:disabled) {
  background: rgb(219, 58, 58);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}
```

**Outline Button**
```css
.admin-button--outline {
  background: transparent;
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
}

.admin-button--outline:hover:not(:disabled) {
  background: var(--color-background-secondary);
  border-color: var(--color-primary);
  color: var(--color-primary);
}
```

#### 버튼 크기 (Button Sizes)

**Small Button**
```css
.admin-button--sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}
```

**Large Button**
```css
.admin-button--lg {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
}
```

### 배지 컴포넌트 (Badge Component)

```css
.admin-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Status Badges */
.admin-badge--published {
  background: rgba(108, 210, 143, 0.15);
  color: var(--color-accent-success);
}

.admin-badge--draft {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-accent-warning);
}

.admin-badge--archived {
  background: rgba(156, 163, 175, 0.15);
  color: var(--color-foreground-muted);
}
```

### 입력 컴포넌트 (Input Component)

#### 기본 입력 필드
```css
.admin-input {
  width: 100%;
  padding: var(--space-3);
  font-size: var(--text-base);
  line-height: 1.5;
  color: var(--color-foreground);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.admin-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(90, 169, 255, 0.1);
}

.admin-input::placeholder {
  color: var(--color-foreground-muted);
}
```

#### 선택 컴포넌트
```css
.admin-select {
  width: 100%;
  padding: var(--space-3);
  font-size: var(--text-base);
  color: var(--color-foreground);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.admin-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(90, 169, 255, 0.1);
}
```

---

## 🎭 애니메이션 패턴

### 트랜지션 (Transitions)

#### 표준 트랜지션
```css
/* 빠른 상호작용 */
--transition-fast: 0.15s ease;

/* 표준 트랜지션 */
--transition-base: 0.2s ease;

/* 느린 트랜지션 */
--transition-slow: 0.3s ease;
```

#### 사용 패턴
```css
.admin-element {
  transition: all var(--transition-base);
}

.admin-element--fast {
  transition: all var(--transition-fast);
}

.admin-element--slow {
  transition: all var(--transition-slow);
}
```

### 호버 효과 (Hover Effects)

#### 카드 호버
```css
.admin-card {
  transition: all var(--transition-base);
}

.admin-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--color-primary);
}
```

#### 버튼 호버
```css
.admin-button {
  transition: all var(--transition-base);
}

.admin-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### 로딩 애니메이션 (Loading Animations)

#### 스피너
```css
@keyframes admin-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.admin-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--color-border);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: admin-spin 1s linear infinite;
}
```

#### 펄스
```css
@keyframes admin-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.admin-pulse {
  animation: admin-pulse 2s infinite;
}
```

---

## 🎯 인터랙션 가이드라인

### 포커스 관리 (Focus Management)

#### 기본 포커스 스타일
```css
.admin-focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(90, 169, 255, 0.3);
  border-color: var(--color-primary);
}

/* 모든 포커스 가능한 요소에 적용 */
.admin-button:focus,
.admin-input:focus,
.admin-select:focus,
.admin-link:focus {
  @extend .admin-focus;
}
```

### 상태 표시 (State Indication)

#### 로딩 상태
```css
.admin-loading {
  position: relative;
  pointer-events: none;
  opacity: 0.7;
}

.admin-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1rem;
  height: 1rem;
  margin: -0.5rem 0 0 -0.5rem;
  border: 2px solid var(--color-border);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: admin-spin 1s linear infinite;
}
```

#### 오류 상태
```css
.admin-error {
  border-color: var(--color-accent-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.admin-error-message {
  color: var(--color-accent-error);
  font-size: var(--text-sm);
  margin-top: var(--space-2);
}
```

#### 성공 상태
```css
.admin-success {
  border-color: var(--color-accent-success);
  box-shadow: 0 0 0 3px rgba(108, 210, 143, 0.1);
}

.admin-success-message {
  color: var(--color-accent-success);
  font-size: var(--text-sm);
  margin-top: var(--space-2);
}
```

---

## 📱 반응형 디자인 (Responsive Design)

### 브레이크포인트 (Breakpoints)

```css
/* 모바일 우선 설계 */
@media (min-width: 640px) {  /* sm */
  /* 작은 태블릿 */
}

@media (min-width: 768px) {  /* md */
  /* 태블릿 */
}

@media (min-width: 1024px) { /* lg */
  /* 데스크톱 */
}

@media (min-width: 1280px) { /* xl */
  /* 큰 데스크톱 */
}
```

### 반응형 그리드
```css
.admin-responsive-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .admin-responsive-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .admin-responsive-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }
}
```

---

## 💡 사용 예시

### 관리자 포스트 카드 예시

```tsx
interface AdminPostCardProps {
  title: string;
  status: 'published' | 'draft' | 'archived';
  date: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function AdminPostCard({ 
  title, 
  status, 
  date, 
  onEdit, 
  onDelete 
}: AdminPostCardProps) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="admin-card-title">{title}</h3>
        <span className={`admin-badge admin-badge--${status}`}>
          {status}
        </span>
      </div>
      
      <div className="admin-card-content">
        <p className="admin-text-muted">
          마지막 수정: {date}
        </p>
      </div>
      
      <div className="admin-card-footer">
        <button 
          className="admin-button admin-button--outline admin-button--sm"
          onClick={onEdit}
        >
          수정
        </button>
        <button 
          className="admin-button admin-button--danger admin-button--sm"
          onClick={onDelete}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
```

### 관리자 헤더 예시

```tsx
export function AdminHeader({ title, children }: { 
  title: string; 
  children?: React.ReactNode; 
}) {
  return (
    <header className="admin-header">
      <h1 className="admin-title">{title}</h1>
      <div className="admin-actions">
        {children}
      </div>
    </header>
  );
}
```

### 관리자 폼 예시

```tsx
export function AdminForm({ onSubmit, children }: {
  onSubmit: (data: FormData) => void;
  children: React.ReactNode;
}) {
  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-form-group">
        <label className="admin-label" htmlFor="title">
          제목
        </label>
        <input 
          className="admin-input"
          type="text"
          id="title"
          name="title"
          placeholder="제목을 입력하세요"
        />
      </div>
      
      <div className="admin-form-group">
        <label className="admin-label" htmlFor="status">
          상태
        </label>
        <select className="admin-select" id="status" name="status">
          <option value="draft">초안</option>
          <option value="published">게시됨</option>
          <option value="archived">보관됨</option>
        </select>
      </div>
      
      <div className="admin-form-actions">
        <button 
          type="button"
          className="admin-button admin-button--outline"
        >
          취소
        </button>
        <button 
          type="submit"
          className="admin-button admin-button--primary"
        >
          저장
        </button>
      </div>
      
      {children}
    </form>
  );
}
```

---

## 🔍 품질 관리 (Quality Assurance)

### CSS 검증 체크리스트

- [ ] 모든 색상이 디자인 토큰을 사용하는가?
- [ ] 간격이 표준 spacing system을 따르는가?
- [ ] 폰트 크기와 두께가 표준을 따르는가?
- [ ] 호버/포커스 상태가 일관성 있게 구현되었는가?
- [ ] 반응형 디자인이 모든 브레이크포인트에서 작동하는가?
- [ ] 접근성 가이드라인이 준수되었는가?
- [ ] 애니메이션이 사용자 경험을 향상시키는가?

### 성능 최적화

- 불필요한 CSS 규칙 제거
- 중복된 스타일 통합
- 트랜지션과 애니메이션 최적화
- 반응형 이미지 사용
- Critical CSS 우선 로딩

---

## 📝 마무리

이 디자인 시스템은 `@app\admin\posts\` 페이지를 기준으로 표준화되었으며, 모든 관리자 컴포넌트는 이 가이드라인을 따라야 합니다. 일관성 있는 사용자 경험을 위해 모든 개발자는 이 문서를 참고하여 컴포넌트를 개발해야 합니다.

### 업데이트 이력

- **v1.0** (2024-01-XX): 초기 디자인 시스템 문서 작성
- **v1.1** (2024-01-XX): 반응형 디자인 섹션 추가
- **v1.2** (2024-01-XX): 접근성 가이드라인 보완

---

*이 문서는 지속적으로 업데이트되며, 새로운 패턴과 컴포넌트가 추가될 때마다 개정될 예정입니다.*