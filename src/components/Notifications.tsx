// src/components/Notifications.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

interface Notification {
  id: number;
  type: 'post_like' | 'comment_like' | 'comment' | 'follow';
  actor_username: string;
  actor_avatar: string;
  post_id?: number;
  post_title?: string;
  comment_id?: number;
  is_read: boolean;
  created_at: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId: number) {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async function markAllAsRead() {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'POST',
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'post_like':
        return (
          <>
            liked your post <span className="font-semibold">"{notification.post_title}"</span>
          </>
        );
      case 'comment_like':
        return 'liked your comment';
      case 'comment':
        return (
          <>
            commented on your post <span className="font-semibold">"{notification.post_title}"</span>
          </>
        );
      case 'follow':
        return 'started following you';
      default:
        return '';
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.post_id) {
      return `/blog/${notification.post_id}`;
    }
    if (notification.type === 'follow') {
      return `/profile/${notification.actor_username}`;
    }
    return '#';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'post_like':
        return '❤️';
      case 'comment_like':
        return '💬';
      case 'comment':
        return '💭';
      case 'follow':
        return '👤';
      default:
        return '🔔';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-surface-elevated rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-primary">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="error" size="sm">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-tertiary hover:text-primary transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔔</span>
            <p className="text-tertiary">No notifications yet</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              href={getNotificationLink(notification)}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <Card
                hover
                className={`${
                  !notification.is_read
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar 
                      name={notification.actor_username} 
                      emoji={notification.actor_avatar}
                      size="md" 
                    />
                    <span className="absolute -bottom-1 -right-1 text-lg">
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-secondary">
                      <span className="font-semibold">{notification.actor_username}</span>{' '}
                      {getNotificationText(notification)}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {new Date(notification.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}