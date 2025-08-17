import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from '../services/postService';

export default function ImageFeed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postService.getAllPosts();
        setPosts(response.posts || []);
      } catch (error) {
        setError(error.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleNewPost = () => {
    navigate('/create-post');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* New Post Button */}
      <button
        onClick={handleNewPost}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
      >
        <span className="text-2xl font-bold">+</span>
      </button>
      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No posts available</p>
          <button
            onClick={handleNewPost}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create your first post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => {/* TODO: Implement post detail view */}}
            >
              {post.fileType === 'video' ? (
                <video
                  src={post.fileUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={post.fileUrl}
                  alt={post.caption}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4">
                  {post.caption && <p className="text-sm font-medium mb-2">{post.caption}</p>}
                  {post.location && <p className="text-xs">📍 {post.location}</p>}
                  {post.hashtags && typeof post.hashtags === 'string' && (
                    <div className="mt-2 text-xs space-x-1">
                      {post.hashtags.split(' ').filter(tag => tag.trim()).map((tag, index) => (
                        <span key={index} className="text-blue-400">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {post.fileType === 'video' && (
                <div className="absolute top-2 right-2">
                  <span className="text-white text-2xl">📹</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
