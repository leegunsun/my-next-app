import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'
import { db } from './config'

// Post interface
export interface BlogPost {
  id?: string
  title: string
  content: string
  excerpt: string
  author: string
  authorEmail: string
  tags: string[]
  category: string
  status: 'draft' | 'published'
  createdAt: Timestamp
  updatedAt: Timestamp
  readTime?: number
}

// Collection references
const POSTS_COLLECTION = 'blog-posts'
const FCM_COLLECTION = 'fcm'

// Create a new blog post
export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { id: docRef.id, error: null }
  } catch (error: unknown) {
    return { id: null, error: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error) }
  }
}

// Update a blog post
export const updateBlogPost = async (postId: string, updates: Partial<BlogPost>) => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, postId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    return { error: null }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error) }
  }
}

// Delete a blog post
export const deleteBlogPost = async (postId: string) => {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, postId))
    return { error: null }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error) }
  }
}

// Get a single blog post
export const getBlogPost = async (postId: string) => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, postId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { 
        post: { id: docSnap.id, ...docSnap.data() } as BlogPost, 
        error: null 
      }
    } else {
      return { post: null, error: 'Post not found' }
    }
  } catch (error: unknown) {
    return { post: null, error: error instanceof Error ? error.message : String(error) }
  }
}

// Get published blog posts with pagination
export const getPublishedPosts = async (
  pageSize: number = 10, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _lastDoc?: QueryDocumentSnapshot<DocumentData>
) => {
  try {
    console.log('🔍 getPublishedPosts called with pageSize:', pageSize)
    
    // First, try a simple query to get all documents and filter in memory
    // This avoids potential index issues
    const allDocsQuery = query(collection(db, POSTS_COLLECTION))
    const allDocsSnapshot = await getDocs(allDocsQuery)
    
    console.log('📊 Total documents found:', allDocsSnapshot.size)
    
    const allPosts: BlogPost[] = []
    allDocsSnapshot.forEach((doc) => {
      const data = doc.data()
      console.log(`📄 Document ${doc.id} status:`, data.status)
      allPosts.push({ id: doc.id, ...data } as BlogPost)
    })
    
    // Filter published posts in memory
    const publishedPosts = allPosts
      .filter(post => post.status === 'published')
      .sort((a, b) => {
        // Sort by createdAt desc
        const aTime = a.createdAt?.toMillis?.() || 0
        const bTime = b.createdAt?.toMillis?.() || 0
        return bTime - aTime
      })
      .slice(0, pageSize)
    
    console.log('✅ Published posts found:', publishedPosts.length)
    console.log('📝 Published posts:', publishedPosts.map(p => ({ id: p.id, title: p.title, status: p.status })))
    
    return { 
      posts: publishedPosts, 
      lastDoc: null, // Simplified for debugging
      hasMore: false, // Simplified for debugging
      error: null 
    }
  } catch (error: unknown) {
    console.error('❌ getPublishedPosts error:', error)
    return { posts: [], lastDoc: null, hasMore: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Get all posts (for admin)
export const getAllPosts = async (
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
) => {
  try {
    let q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('updatedAt', 'desc'),
      limit(pageSize)
    )
    
    if (lastDoc) {
      q = query(
        collection(db, POSTS_COLLECTION),
        orderBy('updatedAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      )
    }
    
    const querySnapshot = await getDocs(q)
    const posts: BlogPost[] = []
    let lastVisible: QueryDocumentSnapshot<DocumentData> | null = null
    
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as BlogPost)
      lastVisible = doc
    })
    
    return { 
      posts, 
      lastDoc: lastVisible, 
      hasMore: posts.length === pageSize,
      error: null 
    }
  } catch (error: unknown) {
    return { posts: [], lastDoc: null, hasMore: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Search posts by title or content
export const searchPosts = async (searchTerm: string) => {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const posts: BlogPost[] = []
    
    querySnapshot.forEach((doc) => {
      const post = { id: doc.id, ...doc.data() } as BlogPost
      if (
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        posts.push(post)
      }
    })
    
    return { posts, error: null }
  } catch (error: unknown) {
    return { posts: [], error: error instanceof Error ? error.message : String(error) }
  }
}

// Get posts by category
export const getPostsByCategory = async (category: string) => {
  try {
    console.log('🔍 getPostsByCategory called with category:', category)
    
    // First try with Firestore index query
    try {
      const q = query(
        collection(db, POSTS_COLLECTION),
        where('status', '==', 'published'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const posts: BlogPost[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        console.log(`📄 Post ${doc.id} - category: ${data.category}, status: ${data.status}`)
        posts.push({ id: doc.id, ...data } as BlogPost)
      })
      
      console.log(`✅ Found ${posts.length} posts for category "${category}"`)
      return { posts, error: null }
    } catch (indexError: unknown) {
      // Check if it's specifically an index error
      const errorCode = (indexError as { code?: string })?.code;
      const errorMessage = indexError instanceof Error ? indexError.message : String(indexError);
      if (errorCode === 'failed-precondition' && errorMessage.includes('index')) {
        console.warn('⚠️ Firestore composite index not deployed. Using fallback method.')
        console.warn('📝 To fix this, run: firebase deploy --only firestore:indexes')
        console.warn('🔗 Or click the link in the error message to create the index in Firebase Console')
        
        // Extract and log the index creation URL if available
        const indexUrlMatch = errorMessage.match(/https:\/\/console\.firebase\.google\.com[^\s]+/)
        if (indexUrlMatch) {
          console.warn(`🔗 Direct link to create index: ${indexUrlMatch[0]}`)
        }
      } else {
        console.log('⚠️ Query failed, falling back to in-memory filtering:', indexError)
      }
      
      // Fallback: Get all published posts and filter in memory
      const allDocsQuery = query(
        collection(db, POSTS_COLLECTION),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      )
      
      const allDocsSnapshot = await getDocs(allDocsQuery)
      const posts: BlogPost[] = []
      
      allDocsSnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.category === category) {
          console.log(`📄 Post ${doc.id} - category: ${data.category}, status: ${data.status}`)
          posts.push({ id: doc.id, ...data } as BlogPost)
        }
      })
      
      console.log(`✅ Found ${posts.length} posts for category "${category}" (fallback method)`)
      return { posts, error: null }
    }
  } catch (error: unknown) {
    console.error('❌ getPostsByCategory error:', error)
    return { posts: [], error: error instanceof Error ? error.message : String(error) }
  }
}

// Calculate reading time (rough estimate)
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// FCM Token interface
export interface FCMTokenData {
  token: string
  updatedAt: Timestamp
  lastUsed?: Timestamp
}

// Get admin FCM token from Firestore
export const getAdminFCMToken = async (): Promise<{ token: string | null; error: string | null }> => {
  try {
    const docRef = doc(db, FCM_COLLECTION, 'master')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FCMTokenData
      
      // Update last used timestamp
      await updateDoc(docRef, {
        lastUsed: serverTimestamp()
      })
      
      return { token: data.token, error: null }
    } else {
      return { token: null, error: 'Master FCM token not found in database' }
    }
  } catch (error: unknown) {
    return { token: null, error: error instanceof Error ? error.message : String(error) }
  }
}

// Update admin FCM token in Firestore
export const updateAdminFCMToken = async (token: string): Promise<{ error: string | null }> => {
  try {
    const docRef = doc(db, FCM_COLLECTION, 'master')
    await setDoc(docRef, {
      token,
      updatedAt: serverTimestamp(),
      lastUsed: serverTimestamp()
    }, { merge: true })
    
    return { error: null }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

// Debug function to check raw collection data
export const debugCollection = async () => {
  try {
    console.log('🔍 Debugging collection directly...')
    
    // Get all documents without any filters first
    const allDocsSnapshot = await getDocs(collection(db, POSTS_COLLECTION))
    console.log(`Total documents in collection: ${allDocsSnapshot.size}`)
    
    allDocsSnapshot.forEach((doc) => {
      console.log(`Document ${doc.id}:`, doc.data())
    })
    
    // Then try the published query
    const publishedQuery = query(
      collection(db, POSTS_COLLECTION),
      where('status', '==', 'published')
    )
    const publishedSnapshot = await getDocs(publishedQuery)
    console.log(`Published documents: ${publishedSnapshot.size}`)
    
    publishedSnapshot.forEach((doc) => {
      console.log(`Published doc ${doc.id}:`, doc.data())
    })
    
    return {
      totalDocs: allDocsSnapshot.size,
      publishedDocs: publishedSnapshot.size
    }
  } catch (error) {
    console.error('Debug error:', error)
    return { totalDocs: 0, publishedDocs: 0, error }
  }
}