import { getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';

export const db = getFirestore(app);

// Firestore에서 검증할 문서 경로
export const AUTH_COLLECTION = 'testUser';
export const AUTH_DOCUMENT_ID = 'R5nOcUf97xB7k3gt0idd';