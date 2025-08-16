import React, { useState } from 'react';

function ImageFeed() {
  // State for storing posts
  const [posts, setPosts] = useState([]);
  
  // State for profile
  const [username, setUsername] = useState('Username');
  const [bio, setBio] = useState('Bio description goes here');
  const [profilePic, setProfilePic] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // State for new post form
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showHeartAnimation, setShowHeartAnimation] = useState(null);
  const [fileType, setFileType] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setSelectedFile(file);
        setFileType(file.type.startsWith('image/') ? 'image' : 'video');
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        alert('Please select a valid image or video file');
      }
    }
  };

  // Handle profile pic change
  const handleProfilePicChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle post creation
  const handlePost = () => {
    if (!selectedFile) {
      alert('Please select a file to post');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPost = {
        id: Date.now(),
        file: reader.result,
        fileType,
        caption,
        likes: 0,
        isLiked: false,
      };
      
      setPosts([newPost, ...posts]);
      // Reset form
      setCaption('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setFileType(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handle like/unlike
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  // Handle double tap like
  const handleDoubleClick = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post.isLiked) {
      handleLike(postId);
      setShowHeartAnimation(postId);
      setTimeout(() => setShowHeartAnimation(null), 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden ${!profilePic ? 'bg-gradient-to-r from-blue-500 to-blue-600' : ''}`}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-2xl font-bold">{username.charAt(0).toUpperCase()}</span>
              )}
            </div>
            {isEditingProfile && (
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer group-hover:opacity-100 opacity-0 transition-opacity">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleProfilePicChange(e.target.files[0])}
                />
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            )}
          </div>
          <div className="flex-1">
            {isEditingProfile ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border rounded-lg text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Username"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2 border rounded-lg text-gray-600 resize-none h-20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Bio"
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900">{username}</h2>
                <p className="text-gray-600">{bio}</p>
              </>
            )}
            <div className="flex items-center justify-between mt-2">
              <div className="flex space-x-4">
                <span className="text-gray-900"><strong>{posts.length}</strong> posts</span>
                <span className="text-gray-900"><strong>0</strong> followers</span>
                <span className="text-gray-900"><strong>0</strong> following</span>
              </div>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isEditingProfile ? 'Save Profile' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Post creation form */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="mb-4">
          {/* File upload area */}
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4 hover:border-blue-500 transition-colors bg-gray-50">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              title="Choose a file"
            />
            {previewUrl ? (
              fileType === 'video' ? (
                <video 
                  src={previewUrl}
                  className="max-h-96 mx-auto rounded-lg shadow-md" 
                  controls
                  playsInline
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-96 mx-auto rounded-lg shadow-md"
                />
              )
            ) : (
              <div className="text-gray-700">
                <svg
                  className="mx-auto h-12 w-12 mb-2 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm font-medium">Click or drag to upload</p>
                <p className="text-xs text-gray-600 mt-1">Images or Videos</p>
              </div>
            )}
          </div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full p-3 border rounded-lg resize-none h-24 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
          />
        </div>
        <button
          onClick={handlePost}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 w-full font-medium transition-all transform hover:scale-[1.02] shadow-md"
        >
          Post
        </button>
      </div>

      {/* Posts feed */}
      <div className="space-y-8">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-900">{username}</span>
              </div>
            </div>
            
            {/* Media with double-click handler */}
            <div 
              onDoubleClick={() => handleDoubleClick(post.id)}
              className="relative"
            >
              {post.fileType === 'video' ? (
                <video 
                  src={post.file}
                  className="w-full" 
                  controls
                  playsInline
                />
              ) : (
                <img 
                  src={post.file} 
                  alt="Post"
                  className="w-full"
                />
              )}
              {showHeartAnimation === post.id && (
                <div className="absolute inset-0 flex items-center justify-center animate-heart">
                  <span className="text-white text-8xl" style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
                    ❤️
                  </span>
                </div>
              )}
            </div>

            {/* Like button and caption */}
            <div className="p-4">
              <button 
                onClick={() => handleLike(post.id)}
                className={`text-3xl mb-2 transform hover:scale-125 transition-transform ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
              >
                ❤️
              </button>
              <p className="font-semibold mb-2 text-gray-900">{post.likes} likes</p>
              <p className="text-gray-800 text-[15px]">
                <span className="font-semibold mr-2">{username}</span>
                {post.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageFeed;
