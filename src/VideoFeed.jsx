import React, { useState, useRef, useEffect } from 'react';

function VideoFeed() {
  // Sample data - in a real app this would come from props or an API
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "@travelexplorer",
      image: "/images/0ab8dc65ea3cc917ab53aa97fbeb8c094f303792.webp",
      caption: "Exploring new horizons! ✈️",
      hashtags: ["#travel", "#adventure", "#explore"],
      likes: 156,
      isLiked: false,
      comments: [
        { id: 1, username: "@wanderlust", text: "Amazing view! 😍" },
        { id: 2, username: "@travelblogger", text: "Where is this?" }
      ]
    },
    {
      id: 2,
      username: "@foodielicious",
      image: "/images/1c12e5569e3aa5205593af4f8067e7cda65e513e.webp",
      caption: "Perfect brunch vibes 🍳",
      hashtags: ["#foodie", "#brunch", "#yummy"],
      likes: 89,
      isLiked: false,
      comments: [
        { id: 1, username: "@chef_mike", text: "Looks delicious! 👨‍🍳" }
      ]
    },
    {
      id: 3,
      username: "@naturelover",
      image: "/images/2b86fc1f580d4d8b91d893d5f63e03493fcefe5d.png",
      caption: "Nature's beauty at its finest 🌿",
      hashtags: ["#nature", "#peaceful", "#outdoors"],
      likes: 234,
      isLiked: false,
      comments: [
        { id: 1, username: "@hikingpro", text: "Stunning location! 🏔️" },
        { id: 2, username: "@photographer", text: "Great composition!" }
      ]
    }
  ]);

  const [commentText, setCommentText] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const videoRefs = useRef({});
  const observerRef = useRef(null);
  const lastTapTime = useRef({});
  const heartRefs = useRef({});

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

    // Clean up observer
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

  return (
    <div className="min-h-screen bg-black">
      {posts.map(post => (
        <div 
          key={post.id} 
          className="relative h-screen snap-start bg-black"
          onDoubleClick={() => handleDoubleClick(post.id)}
        >
          {/* Image */}
          <img
            src={post.image}
            alt={post.caption}
            className="w-full h-full object-cover"
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
              <span className="text-white text-sm">{post.likes}</span>
            </button>

            <button 
              onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
              className="flex flex-col items-center"
            >
              <span className="text-4xl text-white">💬</span>
              <span className="text-white text-sm">{post.comments.length}</span>
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
            <div className="flex flex-wrap gap-2">
              {post.hashtags.map(tag => (
                <span key={tag} className="text-blue-400">{tag}</span>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          {activeCommentPost === post.id && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4">
                {post.comments.map(comment => (
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
      ))}
    </div>
  );
}

export default VideoFeed;
