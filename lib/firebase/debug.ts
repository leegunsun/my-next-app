"use client"

import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './config'

const POSTS_COLLECTION = 'blog-posts'

// Debug function to check all documents in the collection
export const debugAllPosts = async () => {
  try {
    console.log('🔍 Debugging Firebase collection...')
    
    // Get all documents without any filters
    const allDocsQuery = query(collection(db, POSTS_COLLECTION))
    const allDocsSnapshot = await getDocs(allDocsQuery)
    
    console.log(`📊 Total documents in '${POSTS_COLLECTION}' collection:`, allDocsSnapshot.size)
    
    if (allDocsSnapshot.empty) {
      console.log('❌ Collection is empty!')
      return { totalDocs: 0, publishedDocs: 0, documents: [] }
    }
    
    const allDocs: { id: string; [key: string]: unknown }[] = []
    allDocsSnapshot.forEach((doc) => {
      const data = doc.data()
      allDocs.push({ id: doc.id, ...data })
      console.log(`📄 Document ${doc.id}:`, {
        title: data.title || 'No title',
        status: data.status || 'No status',
        category: data.category || 'No category',
        createdAt: data.createdAt || 'No createdAt'
      })
    })
    
    // Check published posts specifically
    const publishedQuery = query(
      collection(db, POSTS_COLLECTION),
      where('status', '==', 'published')
    )
    const publishedSnapshot = await getDocs(publishedQuery)
    
    console.log(`✅ Published documents:`, publishedSnapshot.size)
    
    publishedSnapshot.forEach((doc) => {
      const data = doc.data()
      console.log(`📝 Published post ${doc.id}:`, {
        title: data.title,
        status: data.status,
        category: data.category,
        createdAt: data.createdAt
      })
    })
    
    return {
      totalDocs: allDocsSnapshot.size,
      publishedDocs: publishedSnapshot.size,
      documents: allDocs
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error)
    return { totalDocs: 0, publishedDocs: 0, documents: [], error }
  }
}

// Debug function to test the existing getPublishedPosts function
export const debugPublishedPosts = async () => {
  try {
    console.log('🔍 Testing getPublishedPosts function...')
    
    const { getPublishedPosts } = await import('./firestore')
    const result = await getPublishedPosts(10)
    
    console.log('📊 getPublishedPosts result:', result)
    
    return result
  } catch (error) {
    console.error('❌ getPublishedPosts error:', error)
    return { posts: [], lastDoc: null, hasMore: false, error }
  }
}