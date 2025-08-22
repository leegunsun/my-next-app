import { useState, useEffect } from 'react'
import { getAllPosts } from '../lib/firebase/firestore'

interface AdminStats {
  totalPosts: number
  unreadMessages: number
  loading: boolean
  error: string | null
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalPosts: 0,
    unreadMessages: 0,
    loading: true,
    error: null
  })

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }))

      // Fetch posts count
      const { posts: allPosts, error: postsError } = await getAllPosts(1000) // Get a large number to count all
      
      // Fetch unread messages count using independent query (with error resilience)
      let unreadMessagesCount = 0
      let fetchError = null

      try {
        // Use independent query with minimal pagination to get accurate unread count
        const messagesResponse = await fetch('/api/messages?page=1&limit=1&status=all')
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json()
          // Get unread count from pagination metadata (not from paginated results)
          unreadMessagesCount = messagesData.pagination?.unreadCount || 0
        } else {
          console.warn('Messages API failed, using fallback count of 0')
        }
      } catch (error) {
        console.warn('Messages API error, using fallback count of 0:', error)
      }

      if (postsError) {
        fetchError = postsError
      }

      setStats({
        totalPosts: allPosts.length,
        unreadMessages: unreadMessagesCount,
        loading: false,
        error: fetchError
      })

    } catch (error) {
      console.error('Error fetching admin stats:', error)
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load stats'
      }))
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, refetch: fetchStats }
}