import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfile() {
  const { user } = useAuth();

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6">
          {/* Profile Picture */}
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-semibold">
            {getInitials(user?.username)}
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="block text-2xl font-bold text-gray-900">0</span>
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
          <div className="grid grid-cols-3 gap-4">
            {/* Placeholder for posts */}
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No posts yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
