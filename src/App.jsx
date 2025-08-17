import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import ImageFeed from './components/ImageFeed';
import VideoFeed from './components/VideoFeed';
import CreatePost from './components/CreatePost';
import Navigation from './components/Navigation';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Layout Component for Authenticated Routes
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/create-post"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <CreatePost />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <ImageFeed />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/images"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <ImageFeed />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <VideoFeed />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Profile Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <UserProfile />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <EditProfile />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
