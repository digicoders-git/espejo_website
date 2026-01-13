import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  logoutUser, 
  isLoggedIn as checkLoginStatus 
} from "../services/authService";
import { showSuccess, showError, showInfo } from "../components/CustomLoader";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false); // 🔹 renamed (clean)
  const [loading, setLoading] = useState(true);

  // 🔄 CHECK AUTH ON APP LOAD
  useEffect(() => {
    const checkAuth = async () => {
      const valid = checkLoginStatus();

      if (valid) {
        const profile = await getUserProfile();
        if (profile.success) {
          setUser(profile.data.user || profile.data);
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } else {
        setLoggedIn(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // 🔑 LOGIN
  const login = async (email, password) => {
    const res = await loginUser({ email, password });

    if (res.success) {
      const profile = await getUserProfile();
      if (profile.success) {
        setUser(profile.data.user || profile.data);
      }
      setLoggedIn(true);
      showSuccess("Login successful!");
      return { success: true };
    }

    showError(res.error);
    return { success: false };
  };

  // 📝 REGISTER
  const register = async (data) => {
    const res = await registerUser(data);
    if (res.success) {
      showSuccess("Registration successful! Please login.");
      return { success: true };
    }
    showError(res.error);
    return { success: false };
  };

  // 🚪 LOGOUT
  const logout = () => {
    logoutUser();
    setUser(null);
    setLoggedIn(false);
    showInfo("Logged out successfully");
  };

  // 👤 FETCH PROFILE (IMPORTANT)
  const getProfile = async () => {
    const res = await getUserProfile();
    if (res.success) {
      setUser(res.data.user || res.data);
    }
    return res;
  };

  // ✏️ UPDATE PROFILE
  const updateProfile = async (profileData) => {
    const res = await updateUserProfile(profileData);
    if (res.success) {
      setUser(res.data.user || res.data);
      showSuccess("Profile updated successfully!");
      return { success: true };
    }
    showError(res.error);
    return { success: false };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: loggedIn, // 🔹 expose clean name
        loading,
        login,
        register,
        logout,
        updateProfile,
        getProfile, // ✅ FIX ADDED
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
