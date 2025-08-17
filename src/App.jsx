import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ImageFeed from './ImageFeed';
import VideoFeed from './VideoFeed';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('images');
  const [posts, setPosts] = useState([]);
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      // No need for await since we're using local storage now
    } catch (error) {
      console.error('Failed to log out');
    }
  };

  const handleAddPost = (imageFile, caption) => {
    const newPost = {
      id: Date.now(),
      image: URL.createObjectURL(imageFile),
      caption,
      likes: 0,
      isLiked: false
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleToggleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Giantogram</h1>
            <div className="flex space-x-4 items-center">
              {user && (
                <span className="text-white text-sm">{user.email}</span>
              )}
              <button
                onClick={() => setCurrentPage('images')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'images'
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-blue-500'
                }`}
              >
                Images
              </button>
              <button
                onClick={() => setCurrentPage('videos')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'videos'
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-blue-500'
                }`}
              >
                Videos
              </button>
              {user && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-white hover:bg-blue-500"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mt-8">
        {currentPage === 'images' ? (
          <ImageFeed 
            posts={posts}
            onAddPost={handleAddPost}
            onToggleLike={handleToggleLike}
          />
        ) : (
          <VideoFeed />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
