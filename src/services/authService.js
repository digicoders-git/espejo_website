// 🔐 Authentication Service
const VITE_API_URL = import.meta.env.VITE_API_URL || "https://glassadminpanelapi.onrender.com/api";
const API_BASE = `${VITE_API_URL}/users`;

// 📝 User Registration
export const registerUser = async (userData) => {
  try {
    // console.log('📝 Registering user:', userData.email);
    
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    // console.log('📊 Register response:', { status: response.status, data });

    if (response.ok) {
      // console.log('✅ Registration successful');
      return { success: true, data };
    } else {
      // console.error('❌ Registration failed:', data);
      return { success: false, error: data.message || 'Registration failed' };
    }
  } catch (error) {
    // console.error('🚨 Registration error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// 🔑 User Login
export const loginUser = async (credentials) => {
  try {
    // console.log('🔑 Logging in user:', credentials.email);
    
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    // console.log('📊 Login response:', { status: response.status, data });

    if (response.ok) {
      // console.log('✅ Login successful');
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        // console.log('💾 Token saved to localStorage');
      }
      
      return { success: true, data };
    } else {
      // console.error('❌ Login failed:', data);
      return { success: false, error: data.message || 'Login failed' };
    }
  } catch (error) {
    // console.error('🚨 Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// 👤 Get User Profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // console.warn('⚠️ No token found');
      return { success: false, error: 'No authentication token found' };
    }

    // console.log('👤 Fetching user profile...');
    
    const response = await fetch(`${API_BASE}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    // console.log('📊 Profile response:', { status: response.status, data });

    if (response.ok) {
      // console.log('✅ Profile fetched successfully');
      return { success: true, data };
    } else {
      // console.error('❌ Profile fetch failed:', data);
      
      // Handle token expiry
      if (response.status === 401) {
        // console.warn('🔄 Token expired - clearing localStorage');
        localStorage.removeItem('token');
      }
      
      return { success: false, error: data.message || 'Failed to fetch profile' };
    }
  } catch (error) {
    // console.error('🚨 Profile fetch error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// ✏️ Update User Profile
export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('⚠️ No token found');
      return { success: false, error: 'No authentication token found' };
    }

    // Transform data to match API schema
    const apiData = {
      firstName: profileData.firstName || '',
      lastName: profileData.lastName || '',
      phone: profileData.phone || '',
      dateOfBirth: profileData.dateOfBirth || '',
      gender: profileData.gender || 'male',
      preferences: {
        newsletter: profileData.preferences?.newsletter || false,
        smsUpdates: profileData.preferences?.smsUpdates || true
      }
    };

    // console.log('✏️ Updating user profile...');
    // console.log('📦 Profile data being sent:', apiData);
    
    const response = await fetch(`${API_BASE}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(apiData),
    });

    const data = await response.json();
    // console.log('📊 Update response:', { status: response.status, data });

    if (response.ok) {
      // console.log('✅ Profile updated successfully');
      return { success: true, data };
    } else {
      console.error('❌ Profile update failed:', data);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      
      return { success: false, error: data.message || 'Failed to update profile' };
    }
  } catch (error) {
    console.error('🚨 Profile update error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// 🚪 Logout User
export const logoutUser = () => {
  // console.log('🚪 Logging out user...');
  localStorage.removeItem('token');
  // console.log('✅ Token removed from localStorage');
  
  return { success: true, message: 'Logged out successfully' };
};

// 🔍 Check if user is logged in
export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      console.warn('⚠️ Token is expired');
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('🚨 Token validation error:', error);
    localStorage.removeItem('token');
    return false;
  }
};