import React from 'react';
import ImageFeed from './ImageFeed';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg mb-8">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">Giantogram</h1>
        </div>
      </nav>
      <ImageFeed />
    </div>
  );
}

export default App;
