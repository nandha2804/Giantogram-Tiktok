import { useState } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';

// Mock user credentials
const MOCK_USER = {
  email: 'user@example.com',
  password: 'password123'
};

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/home');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function PostForm({ onNewPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onNewPost({ title, content, id: Date.now() });
    setTitle('');
    setContent('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow mt-4">
      <h2 className="text-xl font-bold mb-4">Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 h-32"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
        >
          Post
        </button>
      </form>
    </div>
  );
}

function PostList({ posts }) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow mb-4 p-4">
          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
          <p className="text-gray-700">{post.content}</p>
        </div>
      ))}
    </div>
  );
}

function Home() {
  const [posts, setPosts] = useState([]);

  const handleNewPost = (post) => {
    setPosts([post, ...posts]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow mb-4">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Social App</h1>
          <button
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              window.location.href = '/';
            }}
            className="text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
      <PostForm onNewPost={handleNewPost} />
      <PostList posts={posts} />
    </div>
  );
}

function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
