# 메시지 시스템 설정 가이드

이 문서는 웹사이트 메시지 시스템과 FCM 푸시 알림을 설정하는 방법을 설명합니다.

## 🚀 구현된 기능

- ✅ 연락처 양식에서 메시지 제출
- ✅ Firebase Firestore에 메시지 저장
- ✅ 관리자 대시보드에서 메시지 관리
- ✅ FCM을 통한 실시간 푸시 알림
- ✅ 메시지 상태 관리 (읽지 않음/읽음/답변 완료)
- ✅ 관리자 메모 기능

## 📁 추가된 파일들

### API 엔드포인트
- `app/api/messages/route.ts` - 메시지 생성 및 조회
- `app/api/messages/[id]/route.ts` - 메시지 수정 및 삭제

### 관리자 페이지
- `app/admin/messages/page.tsx` - 메시지 관리 대시보드
- `components/admin/FCMSetup.tsx` - FCM 알림 설정 컴포넌트
- `components/admin/AdminSidebar.tsx` - 관리자 사이드바

### FCM 및 유틸리티
- `lib/firebase/fcm.ts` - FCM 서비스 함수들
- `components/ui/badge.tsx` - 상태 배지 컴포넌트
- `public/firebase-messaging-sw.js` - FCM 서비스 워커

### 설정 파일
- `.env.example` - 환경변수 템플릿

## ⚙️ 설정 방법

### 1. Firebase 설정

1. **Firebase Console**에서 프로젝트를 생성하세요.
2. **Authentication** 활성화 (이미 설정됨)
3. **Firestore Database** 활성화:
   - 컬렉션 이름: `messages`
   - 보안 규칙 설정 (관리자만 읽기/쓰기)

```javascript
// Firestore 보안 규칙 예시
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{document} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### 2. FCM (Cloud Messaging) 설정

1. **Firebase Console > Project Settings > Cloud Messaging**으로 이동
2. **Web configuration** 생성:
   - VAPID 키 생성
   - 서버 키 확인

3. **환경변수 설정** (`.env.local` 파일):

```env
# Firebase 기본 설정 (이미 있음)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# FCM 설정 (새로 추가)
NEXT_PUBLIC_FCM_VAPID_KEY=your-vapid-key-here
FCM_SERVER_KEY=your-server-key-here
ADMIN_FCM_TOKEN=will-be-set-after-setup
```

### 3. FCM 서비스 워커 설정

`public/firebase-messaging-sw.js` 파일에서 Firebase 설정을 실제 값으로 변경:

```javascript
firebase.initializeApp({
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com", 
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
})
```

### 4. 관리자 FCM 토큰 설정

1. **관리자로 로그인**하여 `/admin/messages` 페이지 접속
2. **"알림 설정하기"** 버튼 클릭
3. 브라우저에서 **알림 권한 허용**
4. 생성된 **FCM 토큰 복사**
5. 환경변수 `ADMIN_FCM_TOKEN`에 토큰 설정

## 🔧 사용 방법

### 일반 사용자 (메시지 보내기)
1. 웹사이트의 연락처 섹션으로 이동
2. 이름, 이메일, 메시지 입력
3. "메시지 보내기" 버튼 클릭
4. 성공 메시지 확인

### 관리자 (메시지 관리)
1. `/admin/messages` 페이지 접속
2. 받은 메시지 목록 확인
3. 메시지 클릭하여 자세히 보기
4. 상태 변경 (읽음, 답변 완료)
5. 관리자 메모 작성
6. 필요시 메시지 삭제

### 푸시 알림
- 새 메시지가 도착하면 자동으로 알림 발송
- 알림 클릭 시 관리자 메시지 페이지로 이동
- 백그라운드에서도 알림 수신 가능

## 📱 알림 설정 확인

### 데스크탑 (Chrome, Firefox, Edge)
1. 브라우저 주소창의 자물쇠 아이콘 클릭
2. 알림 설정이 "허용"으로 되어 있는지 확인

### 모바일 (Android)
1. 브라우저 설정 > 사이트 설정 > 알림
2. 해당 사이트의 알림이 허용되어 있는지 확인

## 🔍 트러블슈팅

### 알림이 오지 않는 경우
1. **FCM 토큰** 확인: 관리자 페이지에서 토큰이 생성되었는지 확인
2. **환경변수** 확인: `ADMIN_FCM_TOKEN`이 설정되어 있는지 확인
3. **서버 키** 확인: `FCM_SERVER_KEY`가 올바른지 확인
4. **브라우저 권한** 확인: 알림 권한이 허용되어 있는지 확인

### 메시지가 저장되지 않는 경우
1. **Firebase 연결** 확인: 콘솔에서 연결 오류 확인
2. **Firestore 권한** 확인: 데이터베이스 보안 규칙 확인
3. **API 엔드포인트** 확인: 네트워크 탭에서 API 호출 상태 확인

### FCM 서비스 워커 오류
1. **서비스 워커 등록** 확인: 개발자 도구 > Application 탭
2. **Firebase 설정** 확인: `firebase-messaging-sw.js`의 설정값
3. **VAPID 키** 확인: 올바른 VAPID 키 사용 여부

## 📝 데이터베이스 구조

```typescript
// messages 컬렉션
interface Message {
  id: string              // 자동 생성 ID
  name: string           // 보낸 사람 이름
  email: string          // 보낸 사람 이메일
  message: string        // 메시지 내용
  createdAt: Timestamp   // 생성 시간
  status: 'unread' | 'read' | 'replied'  // 상태
  adminNotes?: string    // 관리자 메모
}
```

## 🔐 보안 고려사항

1. **Firestore 규칙**: 관리자만 메시지에 접근 가능하도록 설정
2. **FCM 서버 키**: 환경변수로 안전하게 관리
3. **입력 검증**: API에서 입력값 검증 및 정리
4. **HTTPS**: 프로덕션에서 반드시 HTTPS 사용

## 🚀 배포 시 주의사항

1. **환경변수**: 모든 환경변수가 프로덕션에 설정되어 있는지 확인
2. **서비스 워커**: `firebase-messaging-sw.js`가 올바른 설정으로 배포되는지 확인
3. **도메인 설정**: Firebase 프로젝트에 프로덕션 도메인 추가
4. **HTTPS**: FCM은 HTTPS 환경에서만 작동

이제 메시지 시스템이 완전히 구현되었습니다! 🎉