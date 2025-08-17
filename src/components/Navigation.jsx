import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';

export default function Navigation() {
  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-700';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Giantogram
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/images"
              className={`${isActiveLink('/images')} hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200`}
            >
              Images
            </Link>
            <Link
              to="/videos"
              className={`${isActiveLink('/videos')} hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200`}
            >
              Videos
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Link
            to="/images"
            className={`${isActiveLink('/images')} flex flex-col items-center px-3 py-2 text-xs font-medium hover:text-blue-600 transition-colors duration-200`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Images
          </Link>
          <Link
            to="/videos"
            className={`${isActiveLink('/videos')} flex flex-col items-center px-3 py-2 text-xs font-medium hover:text-blue-600 transition-colors duration-200`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Videos
          </Link>
        </div>
      </div>
    </nav>
  );
}
