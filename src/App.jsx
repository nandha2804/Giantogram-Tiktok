import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import ImageFeed from './ImageFeed';
import VideoFeed from './VideoFeed';
import Navigation from './components/Navigation';

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
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
                <p className="text-gray-600">Profile editing feature coming soon...</p>
              </div>
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
