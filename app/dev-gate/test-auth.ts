/**
 * Dev Gate 인증 시스템 테스트
 * 
 * 이 파일은 Firestore 기반 인증 시스템을 테스트합니다.
 * 실제 데이터베이스 값: 
 * - id: "leegunsun01@gmail.com"
 * - pass: "skdml777&"
 */

import { validateCredentials, setAuthSession, checkAuthSession } from './auth-service';

interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  error?: any;
}

export async function runAuthTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  // 테스트 1: 올바른 자격 증명
  try {
    const result = await validateCredentials('leegunsun01@gmail.com', 'skdml777&');
    results.push({
      testName: '올바른 자격 증명 테스트',
      passed: result.success === true,
      message: result.success ? '로그인 성공' : `로그인 실패: ${result.error}`
    });
  } catch (error) {
    results.push({
      testName: '올바른 자격 증명 테스트',
      passed: false,
      message: '테스트 실행 중 오류',
      error
    });
  }

  // 테스트 2: 잘못된 ID
  try {
    const result = await validateCredentials('wrong@email.com', 'skdml777&');
    results.push({
      testName: '잘못된 ID 테스트',
      passed: result.success === false,
      message: result.success ? '오류: 잘못된 ID가 통과됨' : '잘못된 ID 거부 성공'
    });
  } catch (error) {
    results.push({
      testName: '잘못된 ID 테스트',
      passed: false,
      message: '테스트 실행 중 오류',
      error
    });
  }

  // 테스트 3: 잘못된 비밀번호
  try {
    const result = await validateCredentials('leegunsun01@gmail.com', 'wrongpass');
    results.push({
      testName: '잘못된 비밀번호 테스트',
      passed: result.success === false,
      message: result.success ? '오류: 잘못된 비밀번호가 통과됨' : '잘못된 비밀번호 거부 성공'
    });
  } catch (error) {
    results.push({
      testName: '잘못된 비밀번호 테스트',
      passed: false,
      message: '테스트 실행 중 오류',
      error
    });
  }

  // 테스트 4: 빈 값 처리
  try {
    const result = await validateCredentials('', '');
    results.push({
      testName: '빈 값 처리 테스트',
      passed: result.success === false,
      message: result.success ? '오류: 빈 값이 통과됨' : '빈 값 거부 성공'
    });
  } catch (error) {
    results.push({
      testName: '빈 값 처리 테스트',
      passed: false,
      message: '테스트 실행 중 오류',
      error
    });
  }

  // 테스트 5: 세션 관리
  try {
    // 세션 설정
    setAuthSession(true);
    const hasSession = checkAuthSession();
    
    // 세션 제거
    setAuthSession(false);
    const noSession = checkAuthSession();
    
    results.push({
      testName: '세션 관리 테스트',
      passed: hasSession === true && noSession === false,
      message: hasSession && !noSession ? '세션 관리 정상 작동' : '세션 관리 오류'
    });
  } catch (error) {
    results.push({
      testName: '세션 관리 테스트',
      passed: false,
      message: '테스트 실행 중 오류',
      error
    });
  }

  return results;
}

// 테스트 결과 요약
export function summarizeTestResults(results: TestResult[]): {
  total: number;
  passed: number;
  failed: number;
  successRate: number;
} {
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
  const successRate = total > 0 ? (passed / total) * 100 : 0;

  return {
    total,
    passed,
    failed,
    successRate
  };
}