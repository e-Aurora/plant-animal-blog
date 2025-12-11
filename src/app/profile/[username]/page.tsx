// src/app/profile/[username]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/types/blog';
import PostCard from '@/components/PostCard';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/components/Toast';

interface UserProfile {
  username: string;
  avatar_emoji: string;
  created_at: string;
  post_count: number;
  follower_count: number;
  following_count: number;
  is_following: boolean;
  is_own_profile: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [username]);

  async function fetchProfile() {
    try {
      const res = await fetch(`/api/users/${username}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else if (res.status === 404) {
        router.push('/');
        showToast('User not found', 'error');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserPosts() {
    try {
      const res = await fetch(`/api/users/${username}/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  }

  async function handleFollow() {
    setFollowLoading(true);
    try {
      const res = await fetch(`/api/users/${username}/follow`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(prev => prev ? {
          ...prev,
          is_following: data.is_following,
          follower_count: prev.follower_count + (data.is_following ? 1 : -1)
        } : null);
        showToast(
          data.is_following ? `Following ${username}! 👤` : `Unfollowed ${username}`,
          'success'
        );
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error following user:', error);
      showToast('Error updating follow status', 'error');
    } finally {
      setFollowLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <div className="animate-pulse space-y-4">
            <div className="w-24 h-24 bg-green-200 rounded-full mx-auto"></div>
            <div className="h-6 bg-green-200 rounded w-48 mx-auto"></div>
            <div className="h-4 bg-green-100 rounded w-32 mx-auto"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <ToastContainer />
      
      {/* Profile Header */}
      <Card>
        <div className="text-center">
          <Avatar 
            name={profile.username} 
            emoji={profile.avatar_emoji}
            size="lg"
            className="w-24 h-24 text-4xl mx-auto mb-4"
          />
          
          <h1 className="text-3xl font-bold text-primary mb-2">
            {profile.username}
          </h1>
          
          <p className="text-sm text-tertiary mb-6">
            Member since {new Date(profile.created_at).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{profile.post_count}</p>
              <p className="text-sm text-tertiary">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{profile.follower_count}</p>
              <p className="text-sm text-tertiary">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{profile.following_count}</p>
              <p className="text-sm text-tertiary">Following</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            {profile.is_own_profile ? (
              <>
                <Button
                  onClick={() => router.push('/settings')}
                  variant="outline"
                >
                  Edit Profile
                </Button>
                <Button
                  onClick={() => router.push('/blog/create')}
                  variant="primary"
                >
                  Create Post
                </Button>
              </>
            ) : (
              <Button
                onClick={handleFollow}
                isLoading={followLoading}
                variant={profile.is_following ? 'outline' : 'primary'}
              >
                {profile.is_following ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* User Posts */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-6">
          {profile.is_own_profile ? 'Your Posts' : `${profile.username}'s Posts`}
        </h2>

        {posts.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📝</span>
              <p className="text-tertiary">
                {profile.is_own_profile 
                  ? "You haven't created any posts yet" 
                  : `${profile.username} hasn't posted anything yet`}
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}