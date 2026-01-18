import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Trash2, Check, AlertCircle } from "lucide-react"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export default function Notifications() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const fetchNotifications = async () => {
      try {
        setError(null)
        const data = await api.getNotifications(token)
        setNotifications(data.notifications || [])
        setUnreadCount(data.unread_count || 0)
      } catch (err) {
        const errorMsg = "Failed to load notifications"
        setError(errorMsg)
        console.error(errorMsg, err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [token])

  const handleMarkAsRead = async (notifId: string) => {
    if (!token) return
    try {
      // Optimistic update
      setNotifications(notifications.map(n =>
        n.id === notifId ? { ...n, is_read: true } : n
      ))
      setUnreadCount(Math.max(0, unreadCount - 1))

      // API call
      await api.markNotificationsRead(token, [notifId])
      toast({
        title: "Marked as read",
        description: "Notification marked as read successfully"
      })
    } catch (err) {
      console.error("Failed to mark as read:", err)
      toast({
        title: "Error",
        description: "Could not mark notification as read",
        variant: "destructive"
      })
      // Revert optimistic update
      const data = await api.getNotifications(token)
      setNotifications(data.notifications || [])
      setUnreadCount(data.unread_count || 0)
    }
  }

  const handleDelete = async (notifId: string) => {
    if (!token) return
    try {
      // Optimistic update
      const deleted = notifications.find(n => n.id === notifId)
      setNotifications(notifications.filter(n => n.id !== notifId))
      if (deleted && !deleted.is_read) {
        setUnreadCount(Math.max(0, unreadCount - 1))
      }

      // API call
      await api.deleteNotification(token, notifId)
      toast({
        title: "Deleted",
        description: "Notification deleted successfully"
      })
    } catch (err) {
      console.error("Failed to delete notification:", err)
      toast({
        title: "Error",
        description: "Could not delete notification",
        variant: "destructive"
      })
      // Refresh notifications
      const data = await api.getNotifications(token)
      setNotifications(data.notifications || [])
      setUnreadCount(data.unread_count || 0)
    }
  }

  const markAllAsRead = async () => {
    if (!token || unreadCount === 0) return
    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)

      await api.markNotificationsRead(token, unreadIds)
      toast({
        title: "All marked as read",
        description: "All notifications marked as read"
      })
    } catch (err) {
      console.error("Failed to mark all as read:", err)
      toast({
        title: "Error",
        description: "Could not mark all as read",
        variant: "destructive"
      })
      const data = await api.getNotifications(token)
      setNotifications(data.notifications || [])
      setUnreadCount(data.unread_count || 0)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "achievement":
        return "bg-amber-900 text-amber-200"
      case "mentorship":
        return "bg-blue-900 text-blue-200"
      case "course_recommendation":
        return "bg-green-900 text-green-200"
      case "connection_request":
        return "bg-blue-900 text-blue-200"
      default:
        return "bg-gray-700 text-gray-200"
    }
  }

  if (loading) return <Loader />

  return (
    <div className="container max-w-screen-2xl p-6 lg:p-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-700 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Bell className="w-8 h-8 text-cyan-400" />
            Notifications
          </h1>
          <p className="text-cyan-200 text-sm">Stay updated with your activities and achievements</p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold h-10 px-6"
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Unread Count Badge */}
      {unreadCount > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">You have <strong>{unreadCount}</strong> unread notification{unreadCount !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Empty State */}
      {notifications.length === 0 ? (
        <Card className="bg-blue-800/50 border-cyan-700">
          <CardContent className="pt-12 pb-12 text-center">
            <Bell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300 text-lg font-medium">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-2">You'll see your notifications here as you progress</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`border-l-4 transition-all ${notif.is_read
                  ? "bg-blue-800/30 border-l-gray-600"
                  : "bg-blue-800/50 border-l-cyan-400"
                }`}
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded font-semibold ${getTypeColor(notif.type)}`}
                      >
                        {notif.type.replace(/_/g, " ").toUpperCase()}
                      </span>
                      {!notif.is_read && (
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold text-lg">{notif.title}</h3>
                    <p className="text-gray-300 text-sm mt-2">{notif.message}</p>
                    <p className="text-gray-500 text-xs mt-3">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    {!notif.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-2 text-gray-400 hover:text-cyan-400 transition rounded hover:bg-cyan-900/30"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition rounded hover:bg-red-900/30"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
