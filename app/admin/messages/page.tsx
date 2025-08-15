"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  User, 
  Calendar, 
  MoreVertical, 
  Trash2, 
  Check, 
  Eye, 
  Reply,
  MessageSquare,
  Clock
} from 'lucide-react'
import FCMSetup from '@/components/admin/FCMSetup'
import AdminHeader from '@/components/admin/AdminHeader'
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

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      const data = await response.json()
      
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

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
            msg.id === messageId ? { ...msg, status: status as any } : msg
          )
        )
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(prev => prev ? { ...prev, status: status as any } : null)
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

  useEffect(() => {
    fetchMessages()
  }, [])

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

  const unreadCount = messages.filter(msg => msg.status === 'unread').length

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <h2 className="text-2xl font-medium">메시지 목록</h2>
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={fetchMessages} 
                  variant="outline" 
                  size="sm"
                  disabled={loading}
                  className="bg-background/80 backdrop-blur-sm border-border/50 rounded-2xl hover:border-primary/50 hover:shadow-lg hover:bg-primary/5 transition-all duration-200"
                >
                  새로 고침
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
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all card-interactive glass-effect border-border/30 shadow-sm hover:shadow-lg backdrop-blur-md ${
                        selectedMessage?.id === message.id ? 'ring-2 ring-primary/50 shadow-lg' : ''
                      } ${message.status === 'unread' ? 'border-accent-warning/30 bg-accent-warning/5' : ''}`}
                      onClick={() => setSelectedMessage(message)}
                    >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold truncate">{message.name}</span>
                            {getStatusBadge(message.status)}
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{message.email}</span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {message.message}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(message.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          {message.status === 'unread' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                              className="w-3 h-3 bg-accent-warning rounded-full shadow-sm"
                            />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

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
                        className="mt-3 w-full glass-effect border-border/50 rounded-xl hover:shadow-md transition-all"
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
                          className="glass-effect border-border/50 rounded-xl hover:shadow-md transition-all"
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
        </motion.div>
      </div>
    </div>
  )
}