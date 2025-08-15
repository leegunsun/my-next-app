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
  serverTimestamp
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

// Collection reference
const POSTS_COLLECTION = 'blog-posts'

// Create a new blog post
export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
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
  } catch (error: any) {
    return { error: error.message }
  }
}

// Delete a blog post
export const deleteBlogPost = async (postId: string) => {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, postId))
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
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
  } catch (error: any) {
    return { post: null, error: error.message }
  }
}

// Get published blog posts with pagination
export const getPublishedPosts = async (
  pageSize: number = 10, 
  lastDoc?: QueryDocumentSnapshot<DocumentData>
) => {
  try {
    let q = query(
      collection(db, POSTS_COLLECTION),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    )
    
    if (lastDoc) {
      q = query(
        collection(db, POSTS_COLLECTION),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
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
  } catch (error: any) {
    return { posts: [], lastDoc: null, hasMore: false, error: error.message }
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
  } catch (error: any) {
    return { posts: [], lastDoc: null, hasMore: false, error: error.message }
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
  } catch (error: any) {
    return { posts: [], error: error.message }
  }
}

// Get posts by category
export const getPostsByCategory = async (category: string) => {
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
      posts.push({ id: doc.id, ...doc.data() } as BlogPost)
    })
    
    return { posts, error: null }
  } catch (error: any) {
    return { posts: [], error: error.message }
  }
}

// Calculate reading time (rough estimate)
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}