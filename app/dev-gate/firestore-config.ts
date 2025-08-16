import { getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';

export const db = getFirestore(app);

// Firestore에서 검증할 컬렉션
export const AUTH_COLLECTION = 'testUser';
// 더 이상 특정 문서 ID를 사용하지 않고 컬렉션의 모든 사용자를 검색합니다