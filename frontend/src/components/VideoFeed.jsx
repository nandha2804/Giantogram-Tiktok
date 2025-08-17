import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from '../services/postService';

export default function VideoFeed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  
  const videoRefs = useRef({});
  const observerRef = useRef(null);
  const lastTapTime = useRef({});
  const heartRefs = useRef({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postService.getAllPosts();
        // Filter for video posts only
        const videoPosts = (response.posts || []).filter(post => post.fileType === 'video');
        setPosts(videoPosts);
      } catch (error) {
        setError(error.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Set up Intersection Observer for video autoplay
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(error => console.log("Autoplay prevented:", error));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 } // Video plays when 60% visible
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Observe each video element
  useEffect(() => {
    const videos = document.querySelectorAll('.feed-video');
    videos.forEach(video => {
      if (observerRef.current) {
        observerRef.current.observe(video);
      }
    });
  }, [posts]);

  const handleDoubleClick = (postId) => {
    const now = Date.now();
    const lastTap = lastTapTime.current[postId] || 0;
    const timeDiff = now - lastTap;

    if (timeDiff < 300) { // Double tap detected
      showHeartAnimation(postId);
      handleLike(postId);
    }

    lastTapTime.current[postId] = now;
  };

  const showHeartAnimation = (postId) => {
    if (heartRefs.current[postId]) {
      const heart = heartRefs.current[postId];
      heart.style.opacity = '1';
      heart.style.transform = 'scale(1)';
      
      setTimeout(() => {
        if (heart) {
          heart.style.opacity = '0';
          heart.style.transform = 'scale(0)';
        }
      }, 1000);
    }
  };

  const handleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post
      )
    );
  };

  const handleComment = (postId) => {
    if (!commentText.trim()) return;

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: Date.now(), username: "@currentuser", text: commentText.trim() }
              ]
            }
          : post
      )
    );
    setCommentText('');
    setActiveCommentPost(null);
  };

  const handleShare = (postId) => {
    // In a real app, implement sharing functionality
    alert('Share functionality would go here!');
  };

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
    <div className="min-h-screen bg-black relative">
      {/* New Post Button */}
      <button
        onClick={handleNewPost}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
      >
        <span className="text-2xl font-bold">+</span>
      </button>

      {posts.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-white">
            <p className="mb-4">No videos available</p>
            <button
              onClick={handleNewPost}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create your first video
            </button>
          </div>
        </div>
      ) : (
        posts.map(post => (
          <div 
            key={post.id} 
            className="relative h-screen snap-start bg-black"
            onDoubleClick={() => handleDoubleClick(post.id)}
          >
            {/* Video */}
            <video
              ref={el => videoRefs.current[post.id] = el}
              className="feed-video w-full h-full object-cover"
              src={post.fileUrl}
              loop
              muted
              playsInline
            />

            {/* Heart Animation Overlay */}
            <div
              ref={el => heartRefs.current[post.id] = el}
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 transform scale-0 transition-all duration-300"
            >
              <span className="text-white text-8xl">❤️</span>
            </div>

            {/* Interaction Buttons */}
            <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
              <button 
                onClick={() => handleLike(post.id)}
                className="flex flex-col items-center"
              >
                <span className={`text-4xl ${post.isLiked ? 'text-red-500' : 'text-white'}`}>
                  {post.isLiked ? '❤️' : '🤍'}
                </span>
                <span className="text-white text-sm">{post.likes || 0}</span>
              </button>

              <button 
                onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                className="flex flex-col items-center"
              >
                <span className="text-4xl text-white">💬</span>
                <span className="text-white text-sm">{post.comments?.length || 0}</span>
              </button>

              <button 
                onClick={() => handleShare(post.id)}
                className="flex flex-col items-center"
              >
                <span className="text-4xl text-white">↗️</span>
                <span className="text-white text-sm">Share</span>
              </button>
            </div>

            {/* Caption and Username */}
            <div className="absolute bottom-4 left-4 right-20 text-white">
              <p className="font-bold mb-2">{post.username}</p>
              <p className="mb-2">{post.caption}</p>
              {post.hashtags && typeof post.hashtags === 'string' && (
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.split(' ').filter(tag => tag.trim()).map((tag, index) => (
                    <span key={index} className="text-blue-400">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
            {activeCommentPost === post.id && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  {post.comments?.map(comment => (
                    <div key={comment.id} className="mb-4 text-white">
                      <span className="font-bold">{comment.username}</span>
                      <span className="ml-2">{comment.text}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-black bg-opacity-90">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white"
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      disabled={!commentText.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-full disabled:opacity-50"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
