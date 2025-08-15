import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { auth } from './config'

// Google provider setup
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: undefined // Allow any domain
})

// Sign in with Google with improved error handling
export const signInWithGoogle = async () => {
  try {
    // First attempt with popup
    const result = await signInWithPopup(auth, googleProvider)
    return { user: result.user, error: null }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Check for specific COOP-related errors
    if (errorMessage.includes('Cross-Origin-Opener-Policy') || 
        errorMessage.includes('popup') || 
        errorMessage.includes('window')) {
      
      // Fallback: Try redirect method for better COOP compatibility
      try {
        console.log('🔄 Popup blocked, falling back to redirect method...')
        // Note: signInWithRedirect would require additional setup
        // For now, return a more helpful error message
        return { 
          user: null, 
          error: 'Google 로그인 팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용하거나 이메일 로그인을 사용해주세요.' 
        }
      } catch (redirectError) {
        return { 
          user: null, 
          error: '로그인 중 문제가 발생했습니다. 이메일 로그인을 시도해주세요.' 
        }
      }
    }
    
    return { user: null, error: errorMessage }
  }
}

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { user: result.user, error: null }
  } catch (error: unknown) {
    return { user: null, error: error instanceof Error ? error.message : String(error) }
  }
}

// Create account with email and password
export const createAccount = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { user: result.user, error: null }
  } catch (error: unknown) {
    return { user: null, error: error instanceof Error ? error.message : String(error) }
  }
}

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    return { error: null }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

// Check if user is master
export const isMasterUser = (user: User | null): boolean => {
  if (!user?.email) return false
  const masterEmail = process.env.NEXT_PUBLIC_MASTER_EMAIL
  return user.email === masterEmail
}

// Sign in anonymously
export const signInAnonymous = async () => {
  try {
    const result = await signInAnonymously(auth)
    return { user: result.user, error: null }
  } catch (error: unknown) {
    return { user: null, error: error instanceof Error ? error.message : String(error) }
  }
}

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}