import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import postService from '../services/postService';

export default function UserProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postService.getUserPosts(user.id);
        setPosts(response.posts || []);
        // Successfully loaded posts, clear any previous errors
        setError('');
      } catch (error) {
        setError(error.message || 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPosts();
    }
  }, [user]);

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            {/* Profile Picture */}
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-semibold">
              {getInitials(user?.username)}
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-700 mt-2">{user?.bio || 'No bio yet'}</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/profile/edit')}
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate('/create-post')}
              className="block w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Create Post
            </button>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="block text-2xl font-bold text-gray-900">{posts.length}</span>
              <span className="text-gray-600">Posts</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-gray-900">0</span>
              <span className="text-gray-600">Followers</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-gray-900">0</span>
              <span className="text-gray-600">Following</span>
            </div>
          </div>
        </div>

        {/* User Posts Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts</h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No posts yet</p>
              <button
                onClick={() => navigate('/create-post')}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="aspect-square relative group cursor-pointer">
                  {post.fileType === 'video' ? (
                    <video
                      src={post.fileUrl}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <img
                      src={post.fileUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-sm font-medium">{post.caption}</p>
                      {post.location && (
                        <p className="text-xs mt-1">📍 {post.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
