import React from 'react';

const handleNewPost = () => {
  // Will be implemented later
  alert('Upload new image functionality coming soon!');
};

const postImages = [
  '/images/0ab8dc65ea3cc917ab53aa97fbeb8c094f303792.webp',
  '/images/0b6fca3f23c472cbc97baf74aa2fdf0763b8f07f.jpg',
  '/images/0bfb4a206fda5a77d12f50fef872b166c28e5242.webp',
  '/images/0ca84235c9e349d8b6998461b45599325ccd3301.webp',
  '/images/0cf61869247915859640ac98703d729f141a499f.webp',
  '/images/0e7c97293cd15b0ce0d2dbd687e670c7ebf02256.webp'
];

export default function ImageFeed() {
  return (
    <div className="container mx-auto px-4 relative">
      {/* New Post Button */}
      <button
        onClick={handleNewPost}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
      >
        <span className="text-2xl font-bold">+</span>
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {postImages.map((image, index) => (
          <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={image}
              alt={`Post ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
