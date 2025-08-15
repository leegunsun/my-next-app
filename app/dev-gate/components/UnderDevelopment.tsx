'use client';

import { useState } from 'react';
import { useAuth } from '../auth-context';

export default function UnderDevelopment() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await signIn(id, password);
      
      if (!result.success) {
        setError(result.error || '로그인에 실패했습니다');
      } else if (result.mode === 'fallback') {
        // Fallback 모드로 로그인 성공 시 알림
        console.warn('⚠️ Firestore 권한 오류로 인해 Fallback 모드로 로그인되었습니다.');
        console.warn('Firebase Console에서 Firestore 보안 규칙을 수정해주세요.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
          {!showLogin ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500/20 rounded-full mb-4">
                  <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Under Development</h1>
                <p className="text-gray-400">현재 개발 중인 서비스입니다</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </div>
                  <p className="text-gray-300 text-sm">서비스 준비 중입니다</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </div>
                  <p className="text-gray-300 text-sm">곧 더 나은 모습으로 찾아뵙겠습니다</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </div>
                  <p className="text-gray-300 text-sm">감사합니다</p>
                </div>
              </div>

              <button
                onClick={() => setShowLogin(true)}
                className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-lg transition-colors text-sm"
              >
                관리자 로그인
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ID
                  </label>
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    placeholder="Enter your ID"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg p-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-medium rounded-lg transition-colors"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 text-gray-400 rounded-lg transition-colors"
                >
                  Back
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}