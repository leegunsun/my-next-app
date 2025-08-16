/**
 * Firestore 권한 오류 시 사용할 수 있는 대체 인증 서비스
 * 하드코딩된 값을 사용하는 임시 해결책
 */

export interface AuthCredentials {
  id: string;
  pass: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}



/**
 * 하드코딩된 값으로 인증 (Firestore 접근 불가 시 대체)
 */
export async function validateCredentialsFallback(_inputId: string, _inputPass: string): Promise<AuthResult> {
  try {
    // 간단한 대기 시간으로 비동기 작업 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 보안상 이유로 하드코딩된 인증정보 제거됨
    // 환경변수 또는 서버사이드 인증 구현 필요
    return { 
      success: false, 
      error: '보안상 이유로 fallback 인증이 비활성화되었습니다' 
    };
  } catch (error) {
    console.error('Fallback authentication error:', error);
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
      sessionStorage.setItem('devGateAuthMode', 'fallback'); // 대체 모드 표시
    } else {
      sessionStorage.removeItem('devGateAuth');
      sessionStorage.removeItem('devGateAuthTime');
      sessionStorage.removeItem('devGateAuthMode');
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