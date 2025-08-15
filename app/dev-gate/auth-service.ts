import { doc, getDoc } from 'firebase/firestore';
import { db, AUTH_COLLECTION, AUTH_DOCUMENT_ID } from './firestore-config';
import { validateCredentialsFallback } from './auth-service-fallback';

export interface AuthCredentials {
  id: string;
  pass: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  mode?: 'firestore' | 'fallback';
}

// Fallback 인증 정보 (Firestore 접근 불가 시)
const FALLBACK_CREDENTIALS = {
  id: 'leegunsun01@gmail.com',
  pass: 'skdml777&'
};

/**
 * Firestore 문서에서 인증 정보를 검증합니다.
 * 권한 오류 시 fallback 모드로 전환
 */
export async function validateCredentials(inputId: string, inputPass: string): Promise<AuthResult> {
  try {
    // Firestore에서 인증 문서 가져오기
    const docRef = doc(db, AUTH_COLLECTION, AUTH_DOCUMENT_ID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error('Auth document not found');
      return { 
        success: false, 
        error: '인증 정보를 찾을 수 없습니다' 
      };
    }

    const data = docSnap.data() as AuthCredentials;
    
    // ID와 비밀번호 검증
    if (data.id === inputId && data.pass === inputPass) {
      return { success: true, mode: 'firestore' };
    }

    return { 
      success: false, 
      error: '아이디 또는 비밀번호가 일치하지 않습니다' 
    };
  } catch (error: any) {
    console.error('Firestore authentication error:', error);
    
    // 권한 오류인 경우 fallback 사용
    if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
      console.warn('Firestore 권한 오류 - Fallback 모드 사용');
      console.warn('Firestore 보안 규칙을 수정하세요: testUser 컬렉션 읽기 허용 필요');
      
      // Fallback 인증 (하드코딩된 값)
      if (inputId === FALLBACK_CREDENTIALS.id && inputPass === FALLBACK_CREDENTIALS.pass) {
        return { success: true, mode: 'fallback' };
      }
      
      return { 
        success: false, 
        error: '아이디 또는 비밀번호가 일치하지 않습니다' 
      };
    }
    
    return { 
      success: false, 
      error: '인증 중 오류가 발생했습니다' 
    };
  }
}

/**
 * 세션 스토리지에 인증 상태 저장
 */
export function setAuthSession(authenticated: boolean): void {
  if (typeof window !== 'undefined') {
    if (authenticated) {
      sessionStorage.setItem('devGateAuth', 'true');
      sessionStorage.setItem('devGateAuthTime', Date.now().toString());
    } else {
      sessionStorage.removeItem('devGateAuth');
      sessionStorage.removeItem('devGateAuthTime');
    }
  }
}

/**
 * 세션 스토리지에서 인증 상태 확인
 * 24시간 후 자동 만료
 */
export function checkAuthSession(): boolean {
  if (typeof window === 'undefined') return false;
  
  const isAuth = sessionStorage.getItem('devGateAuth') === 'true';
  const authTime = sessionStorage.getItem('devGateAuthTime');
  
  if (!isAuth || !authTime) return false;
  
  // 24시간 세션 유효성 검사
  const elapsed = Date.now() - parseInt(authTime);
  const twentyFourHours = 24 * 60 * 60 * 1000;
  
  if (elapsed > twentyFourHours) {
    setAuthSession(false);
    return false;
  }
  
  return true;
}

/**
 * 로그아웃 처리
 */
export function logout(): void {
  setAuthSession(false);
  // 페이지 새로고침으로 상태 초기화
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}