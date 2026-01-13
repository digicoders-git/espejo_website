import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useOrder } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import {
  FaUser,
  FaBoxOpen,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaUserTag,
  FaMapMarkerAlt,
  FaTrash
} from "react-icons/fa";

const AddressCard = ({ address, onDelete, onUpdate, isDark }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    street: address.street || "",
    city: address.city || "",
    state: address.state || "",
    zipCode: address.zipCode || "",
    country: address.country || ""
  });

  const handleSave = async () => {
    const success = await onUpdate(address._id, formData);
    if (success) setIsEditing(false);
  };

  return (
    <div className={`p-6 rounded-2xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`}>
      {isEditing ? (
        <div className="space-y-4">
          <input
            value={formData.street}
            onChange={(e) => setFormData({...formData, street: e.target.value})}
            placeholder="Street Address"
            className={`w-full p-3 rounded-lg border ${isDark ? "bg-gray-900 border-gray-600 text-white" : "bg-gray-50 border-gray-300"}`}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              placeholder="City"
              className={`p-3 rounded-lg border ${isDark ? "bg-gray-900 border-gray-600 text-white" : "bg-gray-50 border-gray-300"}`}
            />
            <input
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              placeholder="State"
              className={`p-3 rounded-lg border ${isDark ? "bg-gray-900 border-gray-600 text-white" : "bg-gray-50 border-gray-300"}`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              value={formData.zipCode}
              onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
              placeholder="ZIP Code"
              className={`p-3 rounded-lg border ${isDark ? "bg-gray-900 border-gray-600 text-white" : "bg-gray-50 border-gray-300"}`}
            />
            <input
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              placeholder="Country"
              className={`p-3 rounded-lg border ${isDark ? "bg-gray-900 border-gray-600 text-white" : "bg-gray-50 border-gray-300"}`}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FaSave /> Save
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-semibold">{address.street}</p>
              <p className="text-gray-400">{address.city}, {address.state} {address.zipCode}</p>
              <p className="text-gray-400">{address.country}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(true)} className="bg-[#a76665] hover:bg-[#8f5654] text-white p-2 rounded-lg">
                <FaEdit />
              </button>
              <button onClick={async () => {
                const result = await Swal.fire({
                  title: 'Delete Address?',
                  text: 'Are you sure you want to delete this address?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#ef4444',
                  cancelButtonColor: '#6b7280',
                  confirmButtonText: 'Yes, delete it!',
                  cancelButtonText: 'Cancel'
                });
                
                if (result.isConfirmed) {
                  onDelete(address._id);
                }
              }} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg">
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const { user, isLoggedIn, logout, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const { orders, fetchOrders, cancelOrder, loading, clearOrders, isCleared } = useOrder();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    preferences: {
      newsletter: false,
      smsUpdates: true
    }
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // 🔹 set form data when user loaded
  useEffect(() => {
    if (user) {
      const fullName = user.name || user.firstName + ' ' + user.lastName || "";
      const [firstName, ...lastNameParts] = fullName.split(' ');
      
      setFormData({
        firstName: user.firstName || firstName || "",
        lastName: user.lastName || lastNameParts.join(' ') || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "male",
        preferences: {
          newsletter: user.preferences?.newsletter || false,
          smsUpdates: user.preferences?.smsUpdates || true
        }
      });
    }
  }, [user]);

  // 🔹 fetch orders only when tab open
  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  // 🔹 fetch addresses when addresses tab is opened
  useEffect(() => {
    if (activeTab === "addresses") {
      fetchAddresses();
    }
  }, [activeTab]);

  // 🏠 FETCH ADDRESSES
  const fetchAddresses = async () => {
    setAddressLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://glassadminpanelapi.onrender.com/api/users/addresses/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      // console.error('Error fetching addresses:', error);
    }
    setAddressLoading(false);
  };

  // 🗑️ DELETE ADDRESS
  const deleteAddress = async (addressId) => {
    const result = await Swal.fire({
      title: 'Delete Address?',
      text: 'Are you sure you want to delete this address?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
    
    if (!result.isConfirmed) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://glassadminpanelapi.onrender.com/api/users/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setAddresses(addresses.filter(addr => addr._id !== addressId));
        Swal.fire('Deleted!', 'Address deleted successfully', 'success');
      } else {
        Swal.fire('Error!', 'Failed to delete address', 'error');
      }
    } catch (error) {
      // console.error('Error deleting address:', error);
      Swal.fire('Error!', 'Failed to delete address', 'error');
    }
  };

  // ✏️ UPDATE ADDRESS
  const updateAddress = async (addressId, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://glassadminpanelapi.onrender.com/api/users/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        setAddresses(addresses.map(addr => 
          addr._id === addressId ? { ...addr, ...updatedData } : addr
        ));
        alert('Address updated successfully');
        return true;
      }
    } catch (error) {
      // console.error('Error updating address:', error);
      alert('Failed to update address');
    }
    return false;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Please login
      </div>
    );
  }

  // 🔹 SAVE PROFILE
  const handleSave = async () => {
    if (!formData.firstName.trim()) {
      alert("First name is required");
      return;
    }
    
    setIsUpdating(true);
    const res = await updateProfile(formData);
    if (res.success) {
      setEditMode(false);
    }
    setIsUpdating(false);
  };
  
  const handleCancel = () => {
    const fullName = user?.name || user?.firstName + ' ' + user?.lastName || "";
    const [firstName, ...lastNameParts] = fullName.split(' ');
    
    setFormData({
      firstName: user?.firstName || firstName || "",
      lastName: user?.lastName || lastNameParts.join(' ') || "",
      phone: user?.phone || "",
      dateOfBirth: user?.dateOfBirth || "",
      gender: user?.gender || "male",
      preferences: {
        newsletter: user?.preferences?.newsletter || false,
        smsUpdates: user?.preferences?.smsUpdates || true
      }
    });
    setEditMode(false);
  };

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-gray-100 text-black"
        } py-4 md:py-10 px-2 md:px-4`}
    >
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#a76665] to-[#8f5654] bg-clip-text text-transparent">
            My Account
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Manage your profile & orders
          </p>
        </div>

        {/* TABS */}
        <div className="flex justify-center gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2">
          {["profile", "addresses", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold flex items-center gap-2 text-xs md:text-base whitespace-nowrap flex-shrink-0 ${
                activeTab === tab
                  ? "bg-[#a76665] text-white"
                  : isDark
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-700"
              }`}
            >
              {tab === "profile" ? <FaUser className="text-sm" /> : 
               tab === "addresses" ? <FaMapMarkerAlt className="text-sm" /> : <FaBoxOpen className="text-sm" />}
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* MAIN CARD */}
        <div
          className={`rounded-xl shadow-lg p-6 ${isDark ? "bg-gray-900" : "bg-white"
            }`}
        >
          {/* ================= PROFILE TAB ================= */}
          {activeTab === "profile" && (
            <div className="space-y-10">

              {/* TOP PROFILE */}
              <div
                className={`flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl border-2 ${isDark
                    ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                    : "bg-gradient-to-br from-gray-50 to-white border-gray-200"
                  } shadow-lg`}
              >
                {/* AVATAR */}
                <div className="relative group">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#a76665] shadow-lg transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#a76665] to-[#8f5654] flex items-center justify-center text-4xl font-bold text-white shadow-lg transition-transform group-hover:scale-105">
                      {(formData.firstName || user?.name)?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                {/* BASIC INFO */}
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#a76665] to-[#8f5654] bg-clip-text text-transparent">
                    {user?.name || `${formData.firstName} ${formData.lastName}`.trim() || "User"}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                    <FaEnvelope className="text-sm" />
                    <span>{user?.email}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm bg-gradient-to-r from-[#a76665]/20 to-[#8f5654]/20 text-[#a76665] font-medium">
                      <FaUserTag className="text-xs" />
                      {user?.role || "Customer"}
                    </span>
                    {(user?.phone || formData.phone) && (
                      <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm bg-blue-100 text-blue-700 font-medium">
                        <FaPhone className="text-xs" />
                        {user?.phone || formData.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* PERSONAL */}
                <div
                  className={`p-6 rounded-2xl border ${isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                    } shadow-lg hover:shadow-xl transition-shadow`}
                >
                  <h3 className="text-xl font-semibold mb-6 text-[#a76665] flex items-center gap-2">
                    <FaUser className="text-lg" />
                    Personal Details
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        First Name *
                      </label>
                      <input
                        disabled={!editMode}
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value
                          })
                        }
                        className={`w-full p-4 rounded-lg border transition-all ${isDark
                            ? "bg-gray-900 border-gray-600 text-white"
                            : "bg-gray-50 border-gray-300 text-black"
                          } ${editMode
                            ? "focus:ring-2 focus:ring-[#a76665] focus:border-transparent"
                            : "opacity-70 cursor-not-allowed"
                          }`}
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Last Name
                      </label>
                      <input
                        disabled={!editMode}
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lastName: e.target.value
                          })
                        }
                        className={`w-full p-4 rounded-lg border transition-all ${isDark
                            ? "bg-gray-900 border-gray-600 text-white"
                            : "bg-gray-50 border-gray-300 text-black"
                          } ${editMode
                            ? "focus:ring-2 focus:ring-[#a76665] focus:border-transparent"
                            : "opacity-70 cursor-not-allowed"
                          }`}
                        placeholder="Enter your last name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Phone Number
                      </label>
                      <input
                        disabled={!editMode}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value
                          })
                        }
                        className={`w-full p-4 rounded-lg border transition-all ${isDark
                            ? "bg-gray-900 border-gray-600 text-white"
                            : "bg-gray-50 border-gray-300 text-black"
                          } ${editMode
                            ? "focus:ring-2 focus:ring-[#a76665] focus:border-transparent"
                            : "opacity-70 cursor-not-allowed"
                          }`}
                        placeholder="Enter your phone number"
                        type="tel"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Date of Birth
                      </label>
                      <input
                        disabled={!editMode}
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfBirth: e.target.value
                          })
                        }
                        className={`w-full p-4 rounded-lg border transition-all ${isDark
                            ? "bg-gray-900 border-gray-600 text-white"
                            : "bg-gray-50 border-gray-300 text-black"
                          } ${editMode
                            ? "focus:ring-2 focus:ring-[#a76665] focus:border-transparent"
                            : "opacity-70 cursor-not-allowed"
                          }`}
                        type="date"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Gender
                      </label>
                      <select
                        disabled={!editMode}
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gender: e.target.value
                          })
                        }
                        className={`w-full p-4 rounded-lg border transition-all ${isDark
                            ? "bg-gray-900 border-gray-600 text-white"
                            : "bg-gray-50 border-gray-300 text-black"
                          } ${editMode
                            ? "focus:ring-2 focus:ring-[#a76665] focus:border-transparent"
                            : "opacity-70 cursor-not-allowed"
                          }`}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* PREFERENCES */}
                <div
                  className={`p-6 rounded-2xl border ${isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                    } shadow-lg hover:shadow-xl transition-shadow`}
                >
                  <h3 className="text-xl font-semibold mb-6 text-[#a76665] flex items-center gap-2">
                    <FaUserTag className="text-lg" />
                    Preferences & Settings
                  </h3>

                  <div className="space-y-4">
                    <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? "bg-gray-900" : "bg-gray-50"
                      }`}>
                      <div className="flex items-center gap-2 text-gray-400">
                        <FaEnvelope className="text-sm" />
                        <span className="text-sm font-medium">Newsletter</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={!editMode}
                          checked={formData.preferences.newsletter}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              preferences: {
                                ...formData.preferences,
                                newsletter: e.target.checked
                              }
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#a76665]/30 dark:peer-focus:ring-[#a76665]/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#a76665]"></div>
                      </label>
                    </div>

                    <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? "bg-gray-900" : "bg-gray-50"
                      }`}>
                      <div className="flex items-center gap-2 text-gray-400">
                        <FaPhone className="text-sm" />
                        <span className="text-sm font-medium">SMS Updates</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={!editMode}
                          checked={formData.preferences.smsUpdates}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              preferences: {
                                ...formData.preferences,
                                smsUpdates: e.target.checked
                              }
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#a76665]/30 dark:peer-focus:ring-[#a76665]/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#a76665]"></div>
                      </label>
                    </div>

                    <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? "bg-gray-900" : "bg-gray-50"
                      }`}>
                      <div className="flex items-center gap-2 text-gray-400">
                        <FaCalendarAlt className="text-sm" />
                        <span className="text-sm font-medium">Member Since</span>
                      </div>
                      <span className="font-medium">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 md:gap-4 flex-wrap justify-center md:justify-start">
                {editMode ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 md:px-8 py-3 md:py-4 rounded-xl flex items-center gap-2 md:gap-3 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 text-sm md:text-base"
                    >
                      <FaSave className="text-sm md:text-lg" />
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 md:px-8 py-3 md:py-4 rounded-xl flex items-center gap-2 md:gap-3 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 text-sm md:text-base"
                    >
                      <FaTimes className="text-sm md:text-lg" /> Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-gradient-to-r from-[#a76665] to-[#8f5654] hover:from-[#8f5654] hover:to-[#7d4b4a] text-white px-4 md:px-8 py-3 md:py-4 rounded-xl flex items-center gap-2 md:gap-3 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 text-sm md:text-base"
                  >
                    <FaEdit className="text-sm md:text-lg" /> Edit Profile
                  </button>
                )}

                <button
                  onClick={async () => {
                    setLogoutLoading(true);
                    try {
                      const result = await Swal.fire({
                        title: 'Logout?',
                        text: 'Are you sure you want to logout?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#6b7280',
                        confirmButtonText: 'Yes, logout',
                        cancelButtonText: 'Cancel'
                      });
                      
                      if (result.isConfirmed) {
                        await logout();
                        Swal.fire('Logged out!', 'You have been logged out successfully', 'success');
                      }
                    } finally {
                      setLogoutLoading(false);
                    }
                  }}
                  disabled={logoutLoading}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 md:px-8 py-3 md:py-4 rounded-xl flex items-center gap-2 md:gap-3 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 text-sm md:text-base"
                >
                  {logoutLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <FaSignOutAlt className="text-sm md:text-lg" /> Logout
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================= ADDRESSES TAB ================= */}
          {activeTab === "addresses" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#a76665]" />
                My Addresses
              </h2>

              {addressLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a76665]"></div>
                  <span className="ml-3 text-gray-400">Loading addresses...</span>
                </div>
              )}

              {!addressLoading && addresses.length === 0 && (
                <div className="text-center py-16">
                  <FaMapMarkerAlt className="mx-auto text-6xl text-gray-400 mb-4" />
                  <p className="text-gray-400 text-lg">No addresses found</p>
                  <p className="text-gray-500 text-sm mt-2">Add your delivery addresses here</p>
                </div>
              )}

              <div className="space-y-6">
                {addresses.map((address) => (
                  <AddressCard
                    key={address._id}
                    address={address}
                    onDelete={deleteAddress}
                    onUpdate={updateAddress}
                    isDark={isDark}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ================= ORDERS TAB ================= */}
          {activeTab === "orders" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <FaBoxOpen className="text-[#a76665]" />
                  My Orders
                </h2>
                {orders.length > 0 && (
                  <button
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: 'Clear Order History?',
                        text: 'Are you sure you want to clear all order history?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#6b7280',
                        confirmButtonText: 'Yes, clear all',
                        cancelButtonText: 'Cancel'
                      });
                      
                      if (result.isConfirmed) {
                        await clearOrders();
                        Swal.fire('Cleared!', 'Order history cleared successfully', 'success');
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-xs md:text-sm"
                  >
                    <FaTrash size={12} /> Clear All
                  </button>
                )}
              </div>

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a76665]"></div>
                  <span className="ml-3 text-gray-400">Loading orders...</span>
                </div>
              )}

              {!loading && orders.length === 0 && (
                <div className="text-center py-16">
                  <FaBoxOpen className="mx-auto text-6xl text-gray-400 mb-4" />
                  {isCleared ? (
                    <>
                      <p className="text-gray-400 text-lg">Order history cleared</p>
                      <p className="text-gray-500 text-sm mt-2 mb-4">Your order history has been cleared successfully</p>
                      <button
                        onClick={() => fetchOrders(true)}
                        className="bg-[#a76665] hover:bg-[#8f5654] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Refresh Orders
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-400 text-lg">No orders found</p>
                      <p className="text-gray-500 text-sm mt-2">Your order history will appear here</p>
                    </>
                  )}
                </div>
              )}

              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    onClick={() => navigate(`/order/${order._id}`)}
                    className={`p-6 rounded-2xl border shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02] ${isDark
                        ? "border-gray-700 bg-gray-800 hover:bg-gray-750"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-semibold">
                          Order #{order._id.slice(-6)}
                        </span>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${order.status === 'Delivered' ? 
                        (isDark ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700') :
                        order.status === 'Cancelled' ? 
                        (isDark ? 'bg-red-800 text-red-300' : 'bg-red-100 text-red-700') :
                        order.status === 'Processing' ? 
                        (isDark ? 'bg-blue-800 text-blue-300' : 'bg-blue-100 text-blue-700') :
                        (isDark ? 'bg-[#a76665]/30 text-[#a76665]' : 'bg-[#a76665]/20 text-[#a76665]')
                        }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-[#a76665]">
                          Total: ₹{order.totalAmount || order.total || '0'}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Click to view details
                        </p>
                      </div>

                      {order.status !== "Delivered" &&
                        order.status !== "Cancelled" && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const result = await Swal.fire({
                                title: 'Cancel Order?',
                                text: 'Are you sure you want to cancel this order?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#ef4444',
                                cancelButtonColor: '#6b7280',
                                confirmButtonText: 'Yes, cancel it!',
                                cancelButtonText: 'Keep Order'
                              });
                              
                              if (result.isConfirmed) {
                                const success = await cancelOrder(order._id);
                                if (success) {
                                  Swal.fire('Cancelled!', 'Your order has been cancelled successfully', 'success');
                                } else {
                                  Swal.fire('Cannot Cancel', 'This order cannot be cancelled at this time', 'error');
                                }
                              }
                            }}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 active:scale-95"
                          >
                            Cancel Order
                          </button> 
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;