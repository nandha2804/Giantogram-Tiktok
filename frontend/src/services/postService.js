const API_URL = 'http://localhost:8000/api';

const handleResponse = async (response) => {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Invalid response format from server');
  }
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const postService = {
  getAllPosts: async () => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
  createPost: async (formData) => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  getUserPosts: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/posts/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  }
};

export default postService;
