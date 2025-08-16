import { useState, useEffect, useRef } from 'react';

// Mock video data
const mockVideos = [
  {
    id: 1,
    username: "user1",
    caption: "First TikTok video! #fun #viral",
    videoUrl: "/videos/sample1.mp4", // You'll need to add actual video files
    likes: 1234,
    comments: [
      { id: 1, username: "user2", text: "Amazing!" },
      { id: 2, username: "user3", text: "Love this!" }
    ]
  },
  {
    id: 2,
    username: "user2",
    caption: "Check out this cool effect! #effects #editing",
    videoUrl: "/videos/sample2.mp4",
    likes: 856,
    comments: [
      { id: 3, username: "user1", text: "How did you do that?" }
    ]
  }
];

function VideoPost({ video, onLike, isLiked }) {
  const [showHeart, setShowHeart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  
  const handleDoubleTap = () => {
    if (!isLiked) {
      setShowHeart(true);
      onLike(video.id);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  const handleVideoIntersection = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleVideoIntersection, {
      threshold: 0.5
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div className="relative h-screen snap-start bg-black">
      <div className="relative h-full" onDoubleClick={handleDoubleTap}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={video.videoUrl}
          loop
          muted
          playsInline
        />
        
        {/* Heart animation on double tap */}
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center animate-scale-up">
            <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Video info overlay */}
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <h3 className="text-lg font-bold">{video.username}</h3>
        <p className="mt-2">{video.caption}</p>
      </div>

      {/* Interaction buttons */}
      <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-6">
        <button 
          onClick={() => onLike(video.id)}
          className="flex flex-col items-center"
        >
          <svg className={`w-8 h-8 ${isLiked ? 'text-red-500' : 'text-white'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span className="text-sm mt-1">{video.likes}</span>
        </button>
        <button className="flex flex-col items-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-sm mt-1">{video.comments.length}</span>
        </button>
        <button className="flex flex-col items-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="text-sm mt-1">Share</span>
        </button>
      </div>
    </div>
  );
}

function VideoUploadForm({ onSubmit }) {
  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const videoRef = useRef(null);

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'video/mp4' || file.type === 'video/webm')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoFile) return;

    const newPost = {
      id: Date.now(),
      username: 'user1', // This would come from the logged-in user
      caption: caption,
      videoUrl: previewUrl,
      likes: 0,
      comments: []
    };

    onSubmit(newPost);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/2b86fc1f580d4d8b91d893d5f63e03493fcefe5d.png" alt="Logo" className="h-8" />
            <h1 className="text-2xl font-bold">Create Post</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-text-secondary mb-2">Video</label>
              {previewUrl ? (
                <div className="relative aspect-[9/16] w-full max-w-sm mx-auto bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    src={previewUrl}
                    className="w-full h-full object-contain"
                    controls
                  />
                </div>
              ) : (
                <label className="block w-full max-w-sm mx-auto aspect-[9/16] rounded-lg border-2 border-dashed border-primary hover:border-primary-dark transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleVideoSelect}
                    className="hidden"
                  />
                  <div className="h-full flex flex-col items-center justify-center text-text-secondary">
                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Click to upload video</span>
                    <span className="text-sm mt-2">(MP4 or WebM)</span>
                  </div>
                </label>
              )}
            </div>
            <div>
              <label className="block text-text-secondary mb-2" htmlFor="caption">Caption</label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
                placeholder="Write a caption..."
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-2" htmlFor="hashtags">Hashtags</label>
              <input
                type="text"
                id="hashtags"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="#fun #viral"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!videoFile}
                className="flex-1 bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function VideoFeed({ videos, onLike, likedVideos }) {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {videos.map(video => (
        <VideoPost
          key={video.id}
          video={video}
          onLike={onLike}
          isLiked={likedVideos.includes(video.id)}
        />
      ))}
    </div>
  );
}

function App() {
  const [page, setPage] = useState('login'); // login, signup, profile, edit, upload
  const [videos, setVideos] = useState(mockVideos);
  const [likedVideos, setLikedVideos] = useState([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bio: '',
    profilePicture: '/images/2ad43e41e9f4db0f7cace24fb95935fa73a8eefd.jpg'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setPage('feed');
    }
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    const newUser = {
      ...formData,
      id: Date.now(),
      followers: 0,
      following: 0,
      joined: new Date().toLocaleDateString()
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setPage('feed');
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      setError('No account found. Please sign up first.');
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.email === formData.email && user.password === formData.password) {
      setUser(user);
      setPage('feed');
      setError('');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      bio: formData.bio,
      profilePicture: formData.profilePicture
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setPage('profile');
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, profilePicture: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLike = (videoId) => {
    if (likedVideos.includes(videoId)) {
      setLikedVideos(likedVideos.filter(id => id !== videoId));
      setVideos(videos.map(video => 
        video.id === videoId 
          ? { ...video, likes: video.likes - 1 }
          : video
      ));
    } else {
      setLikedVideos([...likedVideos, videoId]);
      setVideos(videos.map(video => 
        video.id === videoId 
          ? { ...video, likes: video.likes + 1 }
          : video
      ));
    }
  };

  const handleVideoUpload = (newPost) => {
    setVideos([newPost, ...videos]);
    setPage('feed');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setPage('login');
    setFormData({
      username: '',
      email: '',
      password: '',
      bio: '',
      profilePicture: '/images/2ad43e41e9f4db0f7cace24fb95935fa73a8eefd.jpg'
    });
  };

  if (page === 'login') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
          <div className="flex justify-center mb-8">
            <img src="/images/2b86fc1f580d4d8b91d893d5f63e03493fcefe5d.png" alt="Logo" className="h-16" />
          </div>
          <h2 className="text-3xl font-bold text-primary-dark text-center mb-8">Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-text-secondary mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-center text-text-secondary">
            Don't have an account?{' '}
            <button
              onClick={() => setPage('signup')}
              className="text-primary hover:text-primary-dark"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (page === 'signup') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
          <div className="flex justify-center mb-8">
            <img src="/images/2b86fc1f580d4d8b91d893d5f63e03493fcefe5d.png" alt="Logo" className="h-16" />
          </div>
          <h2 className="text-3xl font-bold text-primary-dark text-center mb-8">Sign Up</h2>
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-text-secondary mb-2" htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-2" htmlFor="signup-email">Email</label>
              <input
                type="email"
                id="signup-email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-2" htmlFor="signup-password">Password</label>
              <input
                type="password"
                id="signup-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-6 text-center text-text-secondary">
            Already have an account?{' '}
            <button
              onClick={() => setPage('login')}
              className="text-primary hover:text-primary-dark"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (page === 'feed') {
    return (
      <div className="min-h-screen bg-black">
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent text-white">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <img src="/images/2b86fc1f580d4d8b91d893d5f63e03493fcefe5d.png" alt="Logo" className="h-8" />
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPage('upload')}
                className="bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Upload
              </button>
              <button
                onClick={() => setPage('profile')}
                className="text-white hover:text-gray-300 transition-colors"
              >
                Profile
              </button>
            </div>
          </div>
        </header>
        <VideoFeed videos={videos} onLike={handleLike} likedVideos={likedVideos} />
      </div>
    );
  }

  if (page === 'profile') {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/images/2b86fc1f580d4d8b91d893d5f63e03493fcefe5d.png" alt="Logo" className="h-8" />
              <h1 className="text-2xl font-bold">Profile</h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-white hover:text-primary-light transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center">
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
              />
              <h2 className="text-2xl font-bold text-primary-dark mt-4">{user.username}</h2>
              <p className="text-text-secondary mt-2">{user.email}</p>
              <p className="text-text-secondary mt-1">Joined {user.joined}</p>
              <div className="flex space-x-8 mt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary-dark">{user.followers}</div>
                  <div className="text-text-secondary">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-primary-dark">{user.following}</div>
                  <div className="text-text-secondary">Following</div>
                </div>
              </div>
              <p className="mt-6 text-text-secondary text-center">{user.bio || 'No bio yet'}</p>
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      bio: user.bio || '',
                      profilePicture: user.profilePicture
                    });
                    setPage('edit');
                  }}
                  className="bg-accent hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setPage('feed')}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  View Feed
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (page === 'upload') {
    return <VideoUploadForm onSubmit={handleVideoUpload} />;
  }

  if (page === 'edit') {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/images/2b86fc1f580d4d8b91d893d5f63e03493fcefe5d.png" alt="Logo" className="h-8" />
              <h1 className="text-2xl font-bold">Edit Profile</h1>
            </div>
            <button
              onClick={() => setPage('profile')}
              className="text-white hover:text-primary-light transition-colors"
            >
              Cancel
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex flex-col items-center">
                <img
                  src={formData.profilePicture}
                  alt={user.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
                <label className="mt-4 cursor-pointer">
                  <span className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Change Picture
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              </div>
              <div>
                <label className="block text-text-secondary mb-2" htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
