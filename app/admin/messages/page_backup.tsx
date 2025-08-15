"use client"

import { useState, useEffect } from 'react'
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
  MessageSquare
} from 'lucide-react'
import FCMSetup from '@/components/admin/FCMSetup'
import AdminHeader from '@/components/admin/AdminHeader'
import QuickActions from '@/components/admin/QuickActions'
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
    <div className="min-h-screen bg-background">
      <AdminHeader 
        title="메시지 관리"
        description="웹사이트를 통해 받은 메시지를 관리합니다."
      />
      
      <div className="p-6 lg:p-8">
        {unreadCount > 0 && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              <span className="text-orange-800 font-medium">
                읽지 않은 메시지 {unreadCount}개가 있습니다.
              </span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <QuickActions variant="compact" />
        </div>

        <div className="mb-8">
          <FCMSetup />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">메시지 목록</h2>
              <Button 
                onClick={fetchMessages} 
                variant="outline" 
                size="sm"
                disabled={loading}
              >
                새로 고침
              </Button>
            </div>

            {messages.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">받은 메시지가 없습니다.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <Card 
                    key={message.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''
                    } ${message.status === 'unread' ? 'border-orange-200 bg-orange-50/50' : ''}`}
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
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {selectedMessage.name}
                      </CardTitle>
                      <CardDescription>{selectedMessage.email}</CardDescription>
                    </div>
                    {getStatusBadge(selectedMessage.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">메시지 내용</h4>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">받은 시간:</span>
                      <p className="font-medium">{formatDate(selectedMessage.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">상태:</span>
                      <div className="mt-1">{getStatusBadge(selectedMessage.status)}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">관리자 메모</h4>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="메시지에 대한 메모를 작성하세요..."
                      className="w-full p-3 border rounded-lg resize-none"
                      rows={3}
                    />
                    <Button
                      onClick={() => saveAdminNotes(selectedMessage.id)}
                      disabled={updating}
                      className="mt-2 w-full"
                      variant="outline"
                    >
                      {updating ? '저장 중...' : '메모 저장'}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedMessage.status === 'unread' && (
                      <Button
                        onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                        disabled={updating}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        읽음 처리
                      </Button>
                    )}
                    
                    {selectedMessage.status !== 'replied' && (
                      <Button
                        onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                        disabled={updating}
                        size="sm"
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        답변 완료
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      삭제
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">메시지를 선택하여 자세히 보기</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}