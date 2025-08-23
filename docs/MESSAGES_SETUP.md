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

4. **Cloud Messaging (FCM)** 활성화:
   - 프로젝트 설정 → 클라우드 메시징 탭
   - 서버 키와 발신자 ID 복사

### 2. 환경변수 설정

`.env.local` 파일에 다음 변수들을 추가하세요:

```env
# Firebase Configuration (기존)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (서버사이드)
FIREBASE_SERVICE_ACCOUNT_KEY=your_service_account_key_json

# FCM 서버 키
FIREBASE_SERVER_KEY=your_server_key

# 관리자 이메일 (기존)
NEXT_PUBLIC_MASTER_EMAIL=admin@example.com
```

### 3. Firebase Admin SDK 설정

1. **Firebase Console** → 프로젝트 설정 → 서비스 계정
2. "새 비공개 키 생성" 클릭
3. JSON 파일 다운로드
4. JSON 내용을 한 줄로 변환하여 `FIREBASE_SERVICE_ACCOUNT_KEY`에 설정

```bash
# JSON을 한 줄로 변환하는 예시
cat serviceAccountKey.json | jq -c . | base64
```

### 4. FCM 서비스 워커 설정

`public/firebase-messaging-sw.js` 파일이 올바르게 설정되었는지 확인하세요:

```javascript
import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

const firebaseConfig = {
  // Firebase 설정...
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## 🔧 관리자 설정

### 1. 관리자 계정 생성

1. 웹사이트에서 관리자 이메일로 회원가입/로그인
2. Firestore의 `users` 컬렉션에서 사용자 문서를 찾기
3. `isAdmin: true` 필드 추가

### 2. FCM 토큰 등록

1. 관리자로 로그인
2. `/admin/messages` 페이지 방문
3. "알림 설정" 버튼 클릭
4. 브라우저에서 알림 권한 허용
5. FCM 토큰이 자동으로 등록됨

## 📱 사용 방법

### 사용자 측면

1. **연락처 양식 작성**:
   - 홈페이지 하단의 연락처 섹션에서 메시지 작성
   - 이름, 이메일, 메시지 내용 입력
   - "메시지 전송" 버튼 클릭

2. **제출 확인**:
   - 성공 시 확인 메시지 표시
   - 실패 시 오류 메시지 표시

### 관리자 측면

1. **메시지 관리**:
   - `/admin/messages` 페이지에서 모든 메시지 확인
   - 메시지 상태 변경 (읽지 않음 → 읽음 → 답변 완료)
   - 메시지별 관리자 메모 추가

2. **실시간 알림**:
   - 새 메시지 도착 시 브라우저 푸시 알림 수신
   - 알림 클릭 시 해당 메시지로 이동

3. **메시지 필터링**:
   - 상태별 메시지 필터링
   - 날짜별 정렬

## 🛠️ API 사용법

### 메시지 생성

```javascript
POST /api/messages
Content-Type: application/json

{
  "name": "홍길동",
  "email": "hong@example.com",
  "message": "안녕하세요, 문의드립니다."
}
```

### 메시지 조회 (관리자만)

```javascript
GET /api/messages?status=unread&page=1&limit=10
Authorization: Bearer <admin_token>
```

### 메시지 상태 변경 (관리자만)

```javascript
PATCH /api/messages/[id]
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "status": "read",
  "adminNote": "답변 완료함"
}
```

## 🔍 디버깅 가이드

### 일반적인 문제들

1. **메시지가 저장되지 않음**:
   - Firestore 연결 상태 확인
   - 환경변수 설정 확인
   - 브라우저 콘솔에서 에러 메시지 확인

2. **FCM 알림이 오지 않음**:
   - 알림 권한이 허용되었는지 확인
   - FCM 토큰이 정상적으로 등록되었는지 확인
   - 서비스 워커가 올바르게 로드되었는지 확인

3. **관리자 권한 문제**:
   - 사용자의 `isAdmin` 필드가 `true`인지 확인
   - Firebase Auth 토큰에 admin 클레임이 있는지 확인

### 디버깅 도구

1. **브라우저 개발자 도구**:
   - Console: 자바스크립트 에러 확인
   - Network: API 요청/응답 확인
   - Application: 서비스 워커 상태 확인

2. **Firebase Console**:
   - Firestore: 데이터 저장 상태 확인
   - Authentication: 사용자 인증 상태 확인
   - Cloud Messaging: FCM 메시지 전송 로그 확인

## 🎯 향후 개선사항

### 단기 목표
- [ ] 메시지 검색 기능
- [ ] 메시지 분류/태그 기능
- [ ] 대량 메시지 처리 기능

### 장기 목표
- [ ] 이메일 자동 답변 기능
- [ ] 메시지 통계 대시보드
- [ ] 다국어 지원

## 📞 지원

문제가 발생하거나 추가 기능이 필요한 경우:

1. 이 문서의 디버깅 가이드를 먼저 확인해주세요
2. GitHub Issues에 문제를 등록해주세요
3. 관련 로그와 에러 메시지를 포함해주세요

---

*이 가이드는 메시지 시스템 버전 1.0을 기준으로 작성되었습니다.*