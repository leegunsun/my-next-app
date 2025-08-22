"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  User, 
  Calendar, 
  Trash2, 
  Eye, 
  Reply,
  MessageSquare,
  RefreshCw
} from 'lucide-react'
import FCMSetup from '@/components/admin/FCMSetup'
import AdminHeader from '@/components/admin/AdminHeader'
import PaginationComponent from '@/components/ui/pagination'
import MessageFilters from '@/components/admin/MessageFilters'
// Removed date-fns dependency

interface Message {
  id: string
  name: string
  email: string
  message: string
  createdAt: { seconds: number, nanoseconds: number }
  status: 'unread' | 'read' | 'replied'
  adminNotes?: string
}

interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
  lastDocId: string | null
  unreadCount: number
}

interface StatusCounts {
  all: number
  unread: number
  read: number
  replied: number
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Responsive design
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
    hasNext: false,
    hasPrevious: false,
    lastDocId: null,
    unreadCount: 0
  })
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    all: 0,
    unread: 0,
    read: 0,
    replied: 0
  })

  // Fetch messages with pagination
  const fetchMessages = useCallback(async (page: number = 1, pageSize: number = 10, status: string = 'all', lastDocId?: string) => {
    try {
      setError(null)
      if (page === 1) {
        setLoading(true)
      }
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        status: status
      })
      
      if (lastDocId && page > 1) {
        params.append('lastDocId', lastDocId)
      }
      
      const response = await fetch(`/api/messages?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch messages')
      }
      
      if (data.messages && data.pagination) {
        setMessages(data.messages)
        setPagination(data.pagination)
        
        // Update status counts
        setStatusCounts(prev => ({
          ...prev,
          all: data.pagination.totalCount,
          unread: data.pagination.unreadCount
        }))
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch messages')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Update message status
  const updateMessageStatus = async (messageId: string, status: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, status: status as Message['status'] } : msg
          )
        )
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(prev => prev ? { ...prev, status: status as Message['status'] } : null)
        }
      }
    } catch (error) {
      console.error('Error updating message:', error)
    } finally {
      setUpdating(false)
    }
  }

  // Save admin notes
  const saveAdminNotes = async (messageId: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminNotes })
      })

      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, adminNotes } : msg
          )
        )
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(prev => prev ? { ...prev, adminNotes } : null)
        }
      }
    } catch (error) {
      console.error('Error saving admin notes:', error)
    } finally {
      setUpdating(false)
    }
  }

  // Delete message
  const deleteMessage = async (messageId: string) => {
    if (!confirm('정말로 이 메시지를 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  // Pagination handlers
  const handlePageChange = useCallback((newPage: number) => {
    const lastDocId = newPage > pagination.currentPage ? pagination.lastDocId : undefined
    fetchMessages(newPage, pagination.pageSize, statusFilter, lastDocId || undefined)
  }, [fetchMessages, pagination.currentPage, pagination.lastDocId, pagination.pageSize, statusFilter])
  
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    fetchMessages(1, newPageSize, statusFilter) // Reset to page 1 when changing page size
  }, [fetchMessages, statusFilter])
  
  const handleStatusChange = useCallback((newStatus: string) => {
    setStatusFilter(newStatus)
    fetchMessages(1, pagination.pageSize, newStatus) // Reset to page 1 when changing filter
  }, [fetchMessages, pagination.pageSize])
  
  // Refresh handler
  const handleRefresh = useCallback(() => {
    fetchMessages(pagination.currentPage, pagination.pageSize, statusFilter, pagination.lastDocId || undefined)
  }, [fetchMessages, pagination.currentPage, pagination.pageSize, statusFilter, pagination.lastDocId])
  
  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  useEffect(() => {
    if (selectedMessage) {
      setAdminNotes(selectedMessage.adminNotes || '')
    }
  }, [selectedMessage])

  const getStatusBadge = (status: string) => {
    const variants = {
      unread: { variant: 'destructive' as const, text: '읽지 않음' },
      read: { variant: 'secondary' as const, text: '읽음' },
      replied: { variant: 'default' as const, text: '답변 완료' }
    }
    
    const config = variants[status as keyof typeof variants] || variants.unread
    
    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    )
  }

  const formatDate = (timestamp: { seconds: number, nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const unreadCount = pagination.unreadCount

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>메시지를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Enhanced Background */}
      <div className="absolute inset-0 hero-gradient-bg opacity-15 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <AdminHeader 
          title="메시지 관리"
          description="웹사이트를 통해 받은 메시지를 관리합니다."
        />
      </motion.div>
      
      <div className="p-6 lg:p-8 relative z-10">
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 p-6 glass-effect border border-accent-warning/30 rounded-2xl shadow-sm backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2, type: "spring" }}
                className="w-10 h-10 bg-accent-warning/10 rounded-full flex items-center justify-center"
              >
                <MessageSquare className="h-5 w-5 text-accent-warning" />
              </motion.div>
              <span className="text-foreground font-medium text-lg">
                읽지 않은 메시지 {unreadCount}개가 있습니다.
              </span>
            </div>
          </motion.div>
        )}


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <FCMSetup />
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>오류: {error}</span>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <MessageFilters
            selectedStatus={statusFilter}
            onStatusChange={handleStatusChange}
            loading={loading}
            counts={statusCounts}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`grid gap-8 ${isLargeScreen ? 'lg:grid-cols-3' : 'grid-cols-1'}`}
        >
          <div className={`space-y-6 ${isLargeScreen ? 'lg:col-span-2' : 'col-span-1'}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <h2 className="text-2xl font-medium">메시지 목록</h2>
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleRefresh} 
                  variant="outline" 
                  size="sm"
                  disabled={loading}
                  className="bg-background/80 backdrop-blur-sm border-border/50 rounded-2xl hover:border-primary/50 hover:shadow-lg hover:bg-primary/5 transition-all duration-200"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    '새로 고침'
                  )}
                </Button>
              </motion.div>
            </motion.div>

            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="card-primary glass-effect border-border/30 shadow-sm">
                  <CardContent className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.6, type: "spring" }}
                        className="w-16 h-16 glass-effect rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-border/30"
                      >
                        <Mail className="h-8 w-8 text-foreground-secondary" />
                      </motion.div>
                      <p className="text-foreground-secondary text-lg">받은 메시지가 없습니다.</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="glass-effect border border-border/30 shadow-lg backdrop-blur-md rounded-2xl overflow-hidden"
              >
                {isMobile ? (
                  // Mobile compact list view
                  <div className="max-h-[600px] overflow-y-auto p-2 space-y-2">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                        onClick={() => setSelectedMessage(message)}
                        className={`p-3 rounded-xl cursor-pointer transition-all hover:bg-primary/5 border border-border/20 ${
                          selectedMessage?.id === message.id ? 'bg-primary/10 border-primary/30' : ''
                        } ${message.status === 'unread' ? 'bg-accent-warning/5' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 glass-effect rounded-full flex items-center justify-center border border-border/30 flex-shrink-0">
                            <User className="h-4 w-4 text-foreground-secondary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground truncate flex-1">{message.name}</span>
                              {message.status === 'unread' && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                                  className="w-2 h-2 bg-accent-warning rounded-full flex-shrink-0"
                                />
                              )}
                            </div>
                            <div className="text-xs text-foreground-secondary truncate mb-1">{message.email}</div>
                            <div className="text-sm text-foreground line-clamp-2 mb-2">
                              {message.message}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-foreground-secondary">
                                {formatDate(message.createdAt)}
                              </div>
                              {getStatusBadge(message.status)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // Desktop table view
                  <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-background/50 border-b border-border/30 sticky top-0 backdrop-blur-md">
                        <tr>
                          <th className="text-left p-3 font-medium text-foreground-secondary text-sm">보낸이</th>
                          <th className="text-left p-3 font-medium text-foreground-secondary text-sm">메시지</th>
                          <th className="text-left p-3 font-medium text-foreground-secondary text-sm">날짜</th>
                          <th className="text-left p-3 font-medium text-foreground-secondary text-sm">상태</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((message, index) => (
                          <motion.tr
                            key={message.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            onClick={() => setSelectedMessage(message)}
                            className={`cursor-pointer transition-all hover:bg-primary/5 border-b border-border/20 last:border-b-0 ${
                              selectedMessage?.id === message.id ? 'bg-primary/10 border-primary/30' : ''
                            } ${message.status === 'unread' ? 'bg-accent-warning/5' : ''}`}
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 glass-effect rounded-full flex items-center justify-center border border-border/30">
                                  <User className="h-4 w-4 text-foreground-secondary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium text-foreground truncate">{message.name}</div>
                                  <div className="text-xs text-foreground-secondary truncate">{message.email}</div>
                                </div>
                                {message.status === 'unread' && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                                    className="w-2 h-2 bg-accent-warning rounded-full"
                                  />
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="text-sm text-foreground line-clamp-2 max-w-xs">
                                {message.message}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="text-xs text-foreground-secondary">
                                {formatDate(message.createdAt)}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                {getStatusBadge(message.status)}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          <div className={`${isLargeScreen ? 'lg:col-span-1' : 'col-span-1'}`}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="card-primary glass-effect border-border/30 shadow-lg backdrop-blur-md">
                  <CardHeader className="pb-4">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.2, type: "spring" }}
                            className="w-10 h-10 glass-effect rounded-full flex items-center justify-center shadow-sm border border-border/30"
                          >
                            <User className="h-5 w-5 text-primary" />
                          </motion.div>
                          {selectedMessage.name}
                        </CardTitle>
                        <CardDescription className="text-base mt-2 ml-13">{selectedMessage.email}</CardDescription>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        {getStatusBadge(selectedMessage.status)}
                      </motion.div>
                    </motion.div>
                  </CardHeader>
                
                <CardContent className="space-y-8 pt-2">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <h4 className="font-medium mb-3 text-lg">메시지 내용</h4>
                    <div className="p-4 glass-effect rounded-2xl border border-border/30 shadow-sm">
                      <p className="whitespace-pre-wrap text-foreground leading-relaxed">{selectedMessage.message}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="grid grid-cols-2 gap-6"
                  >
                    <div className="glass-effect p-4 rounded-2xl border border-border/30">
                      <span className="text-foreground-secondary text-sm">받은 시간</span>
                      <p className="font-medium text-foreground mt-1">{formatDate(selectedMessage.createdAt)}</p>
                    </div>
                    <div className="glass-effect p-4 rounded-2xl border border-border/30">
                      <span className="text-foreground-secondary text-sm">상태</span>
                      <div className="mt-2">{getStatusBadge(selectedMessage.status)}</div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <h4 className="font-medium mb-3 text-lg">관리자 메모</h4>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="메시지에 대한 메모를 작성하세요..."
                      className="w-full p-4 glass-effect border border-border/50 rounded-2xl resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm backdrop-blur-md"
                      rows={3}
                    />
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => saveAdminNotes(selectedMessage.id)}
                        disabled={updating}
                        className="mt-3 w-full glass-effect border-border/50 rounded-xl hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg transition-all duration-200"
                        variant="outline"
                      >
                        {updating ? '저장 중...' : '메모 저장'}
                      </Button>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="flex flex-wrap gap-3"
                  >
                    {selectedMessage.status === 'unread' && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                          disabled={updating}
                          variant="outline"
                          size="sm"
                          className="glass-effect border-border/50 rounded-xl hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg transition-all duration-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          읽음 처리
                        </Button>
                      </motion.div>
                    )}
                    
                    {selectedMessage.status !== 'replied' && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                          disabled={updating}
                          size="sm"
                          className="bg-accent-blend text-primary-foreground hover:opacity-90 rounded-xl shadow-sm hover:shadow-md transition-all"
                        >
                          <Reply className="h-4 w-4 mr-2" />
                          답변 완료
                        </Button>
                      </motion.div>
                    )}
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        variant="destructive"
                        size="sm"
                        className="rounded-xl shadow-sm hover:shadow-md transition-all"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="card-primary glass-effect border-border/30 shadow-sm">
                  <CardContent className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1, type: "spring" }}
                        className="w-16 h-16 glass-effect rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-border/30"
                      >
                        <MessageSquare className="h-8 w-8 text-foreground-secondary" />
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-foreground-secondary text-lg"
                      >
                        메시지를 선택하여 자세히 보기
                      </motion.p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            </motion.div>
          </div>
        </motion.div>

        {/* Pagination - Full Width */}
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mt-8"
          >
            <PaginationComponent
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              pageSize={pagination.pageSize}
              hasNext={pagination.hasNext}
              hasPrevious={pagination.hasPrevious}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              loading={loading}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}