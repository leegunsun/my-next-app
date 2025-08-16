'use client';

import { useState } from 'react';
import Link from 'next/link';
import { validateCredentials } from '../auth-service';
import { doc, getDoc } from 'firebase/firestore';
import { db, AUTH_COLLECTION } from '../firestore-config';

// 보안상 이유로 하드코딩된 테스트 인증정보 제거됨
// 테스트는 실제 Firestore 데이터 또는 환경변수 기반으로 수행해야 함

export default function TestLoginPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);



  const addResult = (message: string, success: boolean) => {
    const emoji = success ? '✅' : '❌';
    setTestResults(prev => [...prev, `${emoji} ${message}`]);
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);

    try {
      // Test 1: Firestore 연결 테스트
      addResult('Test 1: Firestore 연결 테스트 시작', true);
      // 하드코딩된 문서 ID 사용 (firestore-config에서 제거됨)
      const AUTH_DOCUMENT_ID = 'R5nOcUf97xB7k3gt0idd';
      const docRef = doc(db, AUTH_COLLECTION, AUTH_DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        addResult(`Firestore 문서 발견: ${AUTH_COLLECTION}/${AUTH_DOCUMENT_ID}`, true);
        const data = docSnap.data();
        addResult(`문서 데이터: id="${data.id}", pass="${data.pass}"`, true);
      } else {
        addResult('Firestore 문서를 찾을 수 없습니다', false);
        setIsLoading(false);
        return;
      }

      // Test 2: 보안상 이유로 하드코딩된 인증정보 테스트 비활성화
      addResult('Test 2: 하드코딩된 인증정보 테스트 - SKIPPED (보안상 이유)', false);
      addResult('실제 Firestore 데이터를 사용한 테스트로 전환 필요', false);

      // Test 3: 잘못된 자격 증명 테스트
      addResult('Test 3: 잘못된 자격 증명 테스트', true);
      const incorrectResult = await validateCredentials('invalid_user', 'invalid_pass');
      
      if (!incorrectResult.success) {
        addResult('잘못된 자격 증명 거부 성공', true);
      } else {
        addResult('잘못된 자격 증명이 통과됨 (오류)', false);
      }

      // Test 4: 빈 값 테스트
      addResult('Test 4: 빈 값 테스트', true);
      const emptyResult = await validateCredentials('', '');
      
      if (!emptyResult.success) {
        addResult('빈 값 거부 성공', true);
      } else {
        addResult('빈 값이 통과됨 (오류)', false);
      }

      // Test 5: 실제 로그인 시뮬레이션 - 비활성화됨
      addResult('Test 5: 실제 로그인 시뮬레이션 - SKIPPED (보안상 이유)', false);
      addResult('하드코딩된 인증정보 제거로 인해 비활성화됨', false);
      addResult('환경변수 또는 실제 Firestore 데이터 기반 테스트 필요', false);

      // 최종 결과
      addResult('=== 테스트 완료 ===', true);
      
    } catch (error) {
      addResult(`테스트 중 오류 발생: ${error}`, false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Dev Gate 로그인 테스트</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">테스트 정보</h2>
          <div className="space-y-2 text-gray-300">
            <p>📍 Firestore 경로: <code className="bg-gray-700 px-2 py-1 rounded">testUser/R5nOcUf97xB7k3gt0idd</code></p>
          </div>
        </div>

        <button
          onClick={runTests}
          disabled={isLoading}
          className="mb-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-medium rounded-lg transition-colors"
        >
          {isLoading ? '테스트 실행 중...' : '테스트 실행'}
        </button>

        {testResults.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">테스트 결과</h2>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`text-sm font-mono ${
                    result.includes('✅') ? 'text-green-400' : 
                    result.includes('❌') ? 'text-red-400' : 
                    'text-gray-300'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}