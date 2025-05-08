const API_BASE = 'https://story-api.dicoding.dev/v1';

// register user baru
async function registerUser(email, password, name='User') {
  try {
    console.log('Registering user:', email);
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return await res.json();
  } catch (error) {
    console.error('Error during registration:', error);
    return { error: true, message: 'Network error during registration' };
  }
}

// login user
async function loginUser(email, password) {
  try {
    console.log('Logging in user:', email);
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  } catch (error) {
    console.error('Error during login:', error);
    return { error: true, message: 'Network error during login' };
  }
}

// mengambil list cerita
async function fetchStories(token = null) {
  try {
    console.log('Fetching stories, token exists:', !!token);
    const res = await fetch(`${API_BASE}/stories?page=1&size=20&location=1`, {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    });
    return await res.json();
  } catch (error) {
    console.error('Error fetching stories:', error);
    return { error: true, message: 'Network error fetching stories' };
  }
}

// mengambil detail cerita
async function fetchStoryDetail(id, token = null) {
  try {
    console.log('Fetching story detail:', id);
    const res = await fetch(`${API_BASE}/stories/${id}`, {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    });
    return await res.json();
  } catch (error) {
    console.error('Error fetching story detail:', error);
    return { error: true, message: 'Network error fetching story detail' };
  }
}

// menambah cerita baru
async function addStory(formData, token = null) {
  try {
    console.log('Adding new story, token exists:', !!token);
    const res = await fetch(`${API_BASE}/stories`, {
      method: 'POST',
      headers: token ? { 'Authorization': 'Bearer ' + token } : {},
      body: formData
    });
    return await res.json();
  } catch (error) {
    console.error('Error adding story:', error);
    return { error: true, message: 'Network error adding story' };
  }
}

export {
  registerUser,
  loginUser,
  fetchStories,
  fetchStoryDetail,
  addStory
};