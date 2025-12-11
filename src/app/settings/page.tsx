// src/app/settings/page.tsx (ENHANCED)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Avatar } from '@/components/ui/Avatar';
import EmojiPicker from '@/components/EmojiPicker';
import { useToast } from '@/components/Toast';

interface User {
  id: number;
  username: string;
  email?: string;
  avatar_emoji: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setUsername(data.user.username);
        setEmail(data.user.email || '');
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      window.location.href = '/login';
    }
  }

  async function handleUpdateAvatar(emoji: string) {
    try {
      const res = await fetch('/api/auth/update-avatar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_emoji: emoji }),
      });

      if (res.ok) {
        setUser(prev => prev ? { ...prev, avatar_emoji: emoji } : null);
        showToast('Avatar updated! 🎨', 'success');
        setShowEmojiPicker(false);
      }
    } catch (error) {
      showToast('Failed to update avatar', 'error');
    }
  }

  async function handleUpdateUsername() {
    if (!username.trim() || username === user?.username) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/update-username', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(prev => prev ? { ...prev, username: data.username } : null);
        showToast('Username updated! ✓', 'success');
      } else {
        showToast(data.error || 'Failed to update username', 'error');
        setUsername(user?.username || '');
      }
    } catch (error) {
      showToast('Error updating username', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/update-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: emailPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(prev => prev ? { ...prev, email } : null);
        showToast('Email updated! ✉️', 'success');
        setEmailPassword('');
      } else {
        showToast(data.error || 'Failed to update email', 'error');
      }
    } catch (error) {
      showToast('Error updating email', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Password changed! 🔒', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.error || 'Failed to change password', 'error');
      }
    } catch (error) {
      showToast('Error changing password', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (!deletePassword) {
      showToast('Please enter your password', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Account deleted', 'success');
        setTimeout(() => window.location.href = '/', 1500);
      } else {
        showToast(data.error || 'Failed to delete account', 'error');
      }
    } catch (error) {
      showToast('Error deleting account', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <ToastContainer />

      <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
      <p className="text-tertiary mb-8">Manage your account settings and preferences</p>

      {/* Avatar Section */}
      <Card>
        <h2 className="text-xl font-semibold text-primary mb-4">Profile Avatar</h2>
        <div className="flex items-center gap-6">
          <Avatar name={user.username} emoji={user.avatar_emoji} size="lg" className="w-20 h-20 text-4xl" />
          <Button onClick={() => setShowEmojiPicker(true)} variant="outline">
            Change Avatar
          </Button>
        </div>
      </Card>

      {/* Username Section */}
      <Card>
        <h2 className="text-xl font-semibold text-primary mb-4">Username</h2>
        <div className="flex gap-3">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleUpdateUsername}
            disabled={loading || !username.trim() || username === user.username}
            variant="primary"
          >
            Update
          </Button>
        </div>
        <p className="text-sm text-muted mt-2">
          This is your public display name
        </p>
      </Card>

      {/* Email Section */}
      <Card>
        <h2 className="text-xl font-semibold text-primary mb-4">Email Address</h2>
        <form onSubmit={handleUpdateEmail} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            label="Current Password (required to change email)"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" isLoading={loading}>
            Update Email
          </Button>
        </form>
      </Card>

      {/* Password Section */}
      <Card>
        <h2 className="text-xl font-semibold text-primary mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <Input
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
          <Button type="submit" variant="primary" isLoading={loading}>
            Change Password
          </Button>
        </form>
      </Card>

      {/* Delete Account Section */}
      <Card className="border-red-200 dark:border-red-800">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
          Danger Zone
        </h2>
        <Alert type="warning">
          Deleting your account is permanent and cannot be undone. All your posts, comments, and likes will be deleted.
        </Alert>
        
        {!showDeleteConfirm ? (
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="danger"
            className="mt-4"
          >
            Delete Account
          </Button>
        ) : (
          <div className="mt-4 space-y-4">
            <Input
              type="password"
              label="Enter your password to confirm deletion"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Password"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleDeleteAccount}
                variant="danger"
                isLoading={loading}
              >
                Confirm Delete
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword('');
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Emoji Picker Modal */}
      {showEmojiPicker && (
        <EmojiPicker
          currentEmoji={user.avatar_emoji}
          onSelect={handleUpdateAvatar}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
}