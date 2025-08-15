'use client';

import { useState } from 'react';
import { validateCredentials } from '../auth-service';
import { doc, getDoc } from 'firebase/firestore';
import { db, AUTH_COLLECTION, AUTH_DOCUMENT_ID } from '../firestore-config';

export default function TestLoginPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 테스트 케이스
  const testCredentials = {
    correct: {
      id: 'leegunsun01@gmail.com',
      pass: 'skdml777&'
    },
    incorrect: {
      id: 'wrong@email.com',
      pass: 'wrongpass'
    }
  };

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

      // Test 2: 올바른 자격 증명 테스트
      addResult('Test 2: 올바른 자격 증명 테스트', true);
      const correctResult = await validateCredentials(
        testCredentials.correct.id,
        testCredentials.correct.pass
      );
      
      if (correctResult.success) {
        addResult(`로그인 성공: ${testCredentials.correct.id}`, true);
      } else {
        addResult(`로그인 실패: ${correctResult.error}`, false);
      }

      // Test 3: 잘못된 자격 증명 테스트
      addResult('Test 3: 잘못된 자격 증명 테스트', true);
      const incorrectResult = await validateCredentials(
        testCredentials.incorrect.id,
        testCredentials.incorrect.pass
      );
      
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

      // Test 5: 실제 로그인 시뮬레이션
      addResult('Test 5: 실제 로그인 시뮬레이션', true);
      const loginTest = await validateCredentials(
        'leegunsun01@gmail.com',
        'skdml777&'
      );
      
      if (loginTest.success) {
        addResult('실제 계정으로 로그인 성공!', true);
        addResult('세션이 생성되었습니다', true);
      } else {
        addResult(`로그인 실패: ${loginTest.error}`, false);
      }

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
            <p>👤 테스트 ID: <code className="bg-gray-700 px-2 py-1 rounded">leegunsun01@gmail.com</code></p>
            <p>🔑 테스트 비밀번호: <code className="bg-gray-700 px-2 py-1 rounded">skdml777&</code></p>
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
          <a
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← 메인으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}