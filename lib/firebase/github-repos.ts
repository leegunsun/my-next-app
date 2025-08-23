import { 
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './config'
import { GitHubRepository } from '../types/portfolio'

// Firestore collection and document configuration
const PORTFOLIO_COLLECTION = 'github-repos'
const GITHUB_REPOS_DOC = 'repositories'

// GitHub repositories Firestore interface
export interface GitHubReposDocument {
  repositories: GitHubRepository[]
  lastUpdated: Timestamp
  version: number
}

/**
 * Save GitHub repositories to Firestore
 * @param repositories Array of GitHub repositories to save
 * @returns Success status and optional error message
 */
export const saveGitHubRepositories = async (repositories: GitHubRepository[]) => {
  try {
    const docRef = doc(db, PORTFOLIO_COLLECTION, GITHUB_REPOS_DOC)
    
    // Prepare data with metadata, preserving individual repository updatedAt for admin changes
    const docData: GitHubReposDocument = {
      repositories: repositories.map(repo => ({
        ...repo,
        // Keep original updatedAt if it exists (for admin settings preservation)
        // Only update if it's a new repository without updatedAt
        updatedAt: repo.updatedAt || new Date().toISOString()
      })),
      lastUpdated: serverTimestamp() as Timestamp,
      version: 1
    }
    
    // Save to Firestore with merge option to preserve other fields
    await setDoc(docRef, docData, { merge: false })
    
    console.log('✅ GitHub repositories saved to Firestore successfully')
    return { success: true, error: null }
  } catch (error: unknown) {
    console.error('❌ Error saving GitHub repositories to Firestore:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred while saving to Firestore'
    }
  }
}

/**
 * Load GitHub repositories from Firestore
 * @returns GitHub repositories data or empty array with error info
 */
export const loadGitHubRepositories = async () => {
  try {
    const docRef = doc(db, PORTFOLIO_COLLECTION, GITHUB_REPOS_DOC)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data() as GitHubReposDocument
      console.log('✅ GitHub repositories loaded from Firestore successfully')
      
      return { 
        repositories: data.repositories || [],
        lastUpdated: data.lastUpdated,
        success: true,
        error: null 
      }
    } else {
      console.log('ℹ️ No GitHub repositories document found in Firestore')
      return { 
        repositories: [],
        lastUpdated: null,
        success: true,
        error: 'No data found in Firestore' 
      }
    }
  } catch (error: unknown) {
    console.error('❌ Error loading GitHub repositories from Firestore:', error)
    return { 
      repositories: [],
      lastUpdated: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred while loading from Firestore'
    }
  }
}

/**
 * Check if Firestore is available and accessible
 * @returns Boolean indicating Firestore availability
 */
export const checkFirestoreAvailability = async (): Promise<boolean> => {
  try {
    // Try to read from github-repos collection to test connectivity
    const testDocRef = doc(db, 'github-repos', '_availability_check')
    await getDoc(testDocRef)
    return true
  } catch (error) {
    console.warn('⚠️ Firestore is not available:', error)
    return false
  }
}

/**
 * Sync in-memory data with Firestore (load latest from Firestore)
 * @returns Latest repositories data from Firestore
 */
export const syncWithFirestore = async () => {
  const isAvailable = await checkFirestoreAvailability()
  
  if (!isAvailable) {
    return {
      repositories: [],
      success: false,
      error: 'Firestore is not available',
      source: 'unavailable'
    }
  }
  
  const result = await loadGitHubRepositories()
  return {
    ...result,
    source: result.success ? 'firestore' : 'error'
  }
}