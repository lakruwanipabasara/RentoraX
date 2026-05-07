import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User, Mail, Phone, MapPin, Edit, Lock
} from 'lucide-react';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('details');
  const [profileImage, setProfileImage] = useState(null);

  const [user, setUser] = useState({
    id: '', name: '', email: '', phone: '',
    addressLine1: '', addressLine2: '', addressLine3: '', profileImage: ''
  });

  const [editForm, setEditForm] = useState({
    name: '', email: '', phone: '',
    addressLine1: '', addressLine2: '', addressLine3: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmNewPassword: ''
  });

  const API_BASE_URL = "http://localhost:8086";

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser || !savedUser.id) { alert("Please login first"); return; }
    loadProfile(savedUser.id);
  }, []);

  const loadProfile = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile/${userId}`);
      if (response.data.success) {
        const data = response.data.data;
        setUser({ id: data.id || '', name: data.name || '', email: data.email || '', phone: data.phone || '', addressLine1: data.addressLine1 || '', addressLine2: data.addressLine2 || '', addressLine3: data.addressLine3 || '', profileImage: data.profileImage || '' });
        setProfileImage(data.profileImage || null);
        setEditForm({ name: data.name || '', email: data.email || '', phone: data.phone || '', addressLine1: data.addressLine1 || '', addressLine2: data.addressLine2 || '', addressLine3: data.addressLine3 || '' });
      } else { alert(response.data.message); }
    } catch (error) { console.error("Profile Load Error:", error); alert("Failed to load profile"); }
  };

  const updateProfileImageToBackend = async (imageData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/profile-image/${user.id}`, { profileImage: imageData });
      if (response.data.success) {
        setProfileImage(imageData);
        const savedUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem("user", JSON.stringify({ ...savedUser, profileImage: imageData }));
        alert(response.data.message);
      } else { alert(response.data.message); }
    } catch (error) { console.error("Profile Image Update Error:", error); alert("Failed to update profile image"); }
  };

  const handleImageChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Only image files allowed"); return; }
    if (file.size > 2 * 1024 * 1024) { alert("Max file size is 2MB"); return; }
    if (!user.id) { alert("User not loaded yet"); return; }
    const reader = new FileReader();
    reader.onloadend = () => updateProfileImageToBackend(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => { e.preventDefault(); handleImageChange(e.dataTransfer.files[0]); };
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleCancelEdit = () => {
    setEditForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', addressLine1: user.addressLine1 || '', addressLine2: user.addressLine2 || '', addressLine3: user.addressLine3 || '' });
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!editForm.name || !editForm.email || !editForm.phone || !editForm.addressLine1 || !editForm.addressLine3) {
      alert("Please fill all required fields"); return;
    }
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/profile/${user.id}`, editForm);
      if (response.data.success) {
        alert(response.data.message);
        await loadProfile(user.id);
        const savedUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem("user", JSON.stringify({ ...savedUser, ...editForm, profileImage: profileImage }));
        setIsEditing(false);
      } else { alert(response.data.message); }
    } catch (error) { console.error("Profile Update Error:", error); alert("Failed to update profile"); }
  };

  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handlePasswordUpdate = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      alert("Please fill all password fields"); return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      alert("New passwords do not match"); return;
    }
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/change-password/${user.id}`, passwordForm);
      if (response.data.success) {
        alert(response.data.message);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else { alert(response.data.message); }
    } catch (error) { console.error("Password Update Error:", error); alert("Failed to update password"); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .rxp-root {
          min-height: 100vh;
          background: #f5f4f0;
          font-family: 'DM Sans', sans-serif;
          padding: 40px 20px 60px;
        }

        .rxp-outer {
          max-width: 900px;
          margin: 0 auto;
        }

        /* Top bar */
        .rxp-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .rxp-brand {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #0d3d36;
        }

        .rxp-brand span { color: #0d7a62; }

        .rxp-badge {
          font-size: 12px;
          font-weight: 600;
          color: #0d7a62;
          background: rgba(13,122,98,0.08);
          padding: 5px 12px;
          border-radius: 20px;
          letter-spacing: 0.04em;
        }

        /* Profile header card */
        .rxp-header-card {
          background: #0d3d36;
          border-radius: 24px;
          padding: 36px 40px;
          display: flex;
          align-items: center;
          gap: 28px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }

        .rxp-header-card::before {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(104,211,145,0.1) 0%, transparent 70%);
          top: -120px;
          right: -60px;
        }

        .rxp-avatar-wrap {
          position: relative;
          flex-shrink: 0;
          cursor: pointer;
        }

        .rxp-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(104,211,145,0.15);
          border: 2.5px solid rgba(104,211,145,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .rxp-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .rxp-avatar-upload {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 26px;
          height: 26px;
          background: #68d391;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: pointer;
          border: 2px solid #0d3d36;
        }

        .rxp-header-info {
          flex: 1;
        }

        .rxp-header-info h2 {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: #fff;
          margin-bottom: 4px;
          font-weight: 700;
        }

        .rxp-header-info p {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
        }

        /* Main content card */
        .rxp-main-card {
          background: #fff;
          border-radius: 24px;
          border: 1px solid #eae9e3;
          box-shadow: 0 2px 20px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        /* Tab navigation */
        .rxp-tabs {
          display: flex;
          border-bottom: 1px solid #eae9e3;
          padding: 0 32px;
          gap: 0;
        }

        .rxp-tab-btn {
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #aaa;
          padding: 18px 20px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: color 0.2s, border-color 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .rxp-tab-btn:hover { color: #0d3d36; }

        .rxp-tab-btn.active {
          color: #0d3d36;
          border-bottom-color: #0d3d36;
          font-weight: 600;
        }

        /* Content area */
        .rxp-content {
          padding: 36px 40px;
        }

        @media (max-width: 600px) {
          .rxp-content { padding: 24px 20px; }
          .rxp-header-card { padding: 24px 20px; }
          .rxp-tabs { padding: 0 16px; }
        }

        /* Info rows */
        .rxp-info-grid {
          display: grid;
          gap: 2px;
        }

        .rxp-info-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 0;
          border-bottom: 1px solid #f0f0ea;
        }

        .rxp-info-row:last-child { border-bottom: none; }

        .rxp-info-icon {
          width: 36px;
          height: 36px;
          background: #f0faf5;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0d7a62;
          flex-shrink: 0;
        }

        .rxp-info-label {
          font-size: 12px;
          color: #aaa;
          font-weight: 500;
          margin-bottom: 2px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .rxp-info-value {
          font-size: 14px;
          color: #1a1a1a;
          font-weight: 500;
        }

        /* Edit button */
        .rxp-btn-edit {
          margin-top: 28px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: #0d3d36;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(13,61,54,0.16);
        }

        .rxp-btn-edit:hover { background: #0a2e29; }

        /* Form fields */
        .rxp-form-section {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #0d7a62;
          margin-bottom: 16px;
          margin-top: 28px;
          padding-bottom: 8px;
          border-bottom: 1px solid #eae9e3;
        }

        .rxp-form-section:first-of-type { margin-top: 0; }

        .rxp-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 560px) {
          .rxp-grid-2 { grid-template-columns: 1fr; }
        }

        .rxp-field {
          margin-bottom: 16px;
        }

        .rxp-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #0d3d36;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .rxp-input {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #e4e4dc;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1a1a;
          background: #fafaf8;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }

        .rxp-input:focus {
          border-color: #0d3d36;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(13,61,54,0.06);
        }

        .rxp-input::placeholder { color: #c0bdb5; }

        .rxp-btn-row {
          display: flex;
          gap: 12px;
          margin-top: 28px;
        }

        .rxp-btn-save {
          padding: 12px 24px;
          background: #0d3d36;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          box-shadow: 0 4px 14px rgba(13,61,54,0.16);
        }

        .rxp-btn-save:hover { background: #0a2e29; }

        .rxp-btn-cancel {
          padding: 12px 24px;
          background: #f0f0ea;
          color: #555;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .rxp-btn-cancel:hover { background: #e4e4dc; }

        /* Activity */
        .rxp-activity-section {
          margin-bottom: 28px;
        }

        .rxp-activity-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 700;
          color: #0d3d36;
          margin-bottom: 12px;
        }

        .rxp-activity-title-icon {
          width: 30px;
          height: 30px;
          background: #f0faf5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0d7a62;
        }

        .rxp-activity-item {
          background: #fafaf8;
          border: 1px solid #eae9e3;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #555;
          margin-bottom: 8px;
        }

        /* Security */
        .rxp-security-wrap {
          max-width: 420px;
        }

        .rxp-security-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #0d3d36;
          margin-bottom: 24px;
        }

        .rxp-btn-update {
          margin-top: 8px;
          padding: 13px 26px;
          background: #0d3d36;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          box-shadow: 0 4px 14px rgba(13,61,54,0.16);
        }

        .rxp-btn-update:hover { background: #0a2e29; }
      `}</style>

      <div className="rxp-root">
        <div className="rxp-outer">

          {/* Top bar */}
          <div className="rxp-topbar">
            <div className="rxp-brand">Rentora<span>X</span></div>
            <div className="rxp-badge">My Account</div>
          </div>

          {/* Profile Header */}
          <div className="rxp-header-card">
            <div
              className="rxp-avatar-wrap"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="rxp-avatar">
                {profileImage
                  ? <img src={profileImage} alt="Profile" />
                  : <User size={32} color="rgba(104,211,145,0.8)" />
                }
              </div>
              <label className="rxp-avatar-upload" title="Upload photo">
                📷
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="rxp-header-info">
              <h2>{user.name || "Your Name"}</h2>
              <p>{user.email || "user@example.com"}</p>
            </div>
          </div>

          {/* Main card */}
          <div className="rxp-main-card">

            {/* Tabs */}
            <div className="rxp-tabs">
              <button className={`rxp-tab-btn ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
                <User size={14} /> Profile Details
              </button>
              <button className={`rxp-tab-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                <Lock size={14} /> Security
              </button>
            </div>

            <div className="rxp-content">

              {/* DETAILS TAB */}
              {activeTab === 'details' && (
                <div>
                  {!isEditing ? (
                    <>
                      <div className="rxp-info-grid">
                        <InfoRow icon={<User size={16} />} label="Full Name" value={user.name} />
                        <InfoRow icon={<Mail size={16} />} label="Email" value={user.email} />
                        <InfoRow icon={<Phone size={16} />} label="Phone" value={user.phone} />
                        <InfoRow icon={<MapPin size={16} />} label="Street Address" value={user.addressLine1} />
                        <InfoRow icon={<MapPin size={16} />} label="Apartment / Building" value={user.addressLine2 || "Not provided"} />
                        <InfoRow icon={<MapPin size={16} />} label="City / District" value={user.addressLine3} />
                      </div>
                      <button className="rxp-btn-edit" onClick={() => setIsEditing(true)}>
                        <Edit size={15} /> Edit Profile
                      </button>
                    </>
                  ) : (
                    <div>
                      <div className="rxp-form-section">Personal Information</div>
                      <div className="rxp-grid-2">
                        <div className="rxp-field">
                          <label className="rxp-label">Full Name</label>
                          <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="rxp-input" placeholder="Full Name" />
                        </div>
                        <div className="rxp-field">
                          <label className="rxp-label">Phone</label>
                          <input type="text" name="phone" value={editForm.phone} onChange={handleEditChange} className="rxp-input" placeholder="Phone Number" />
                        </div>
                      </div>
                      <div className="rxp-field">
                        <label className="rxp-label">Email</label>
                        <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="rxp-input" placeholder="Email" />
                      </div>

                      <div className="rxp-form-section">Address</div>
                      <div className="rxp-field">
                        <label className="rxp-label">Street Address</label>
                        <input type="text" name="addressLine1" value={editForm.addressLine1} onChange={handleEditChange} className="rxp-input" placeholder="Street Address" />
                      </div>
                      <div className="rxp-field">
                        <label className="rxp-label">Apartment / Building</label>
                        <input type="text" name="addressLine2" value={editForm.addressLine2} onChange={handleEditChange} className="rxp-input" placeholder="Optional" />
                      </div>
                      <div className="rxp-field">
                        <label className="rxp-label">City / District</label>
                        <input type="text" name="addressLine3" value={editForm.addressLine3} onChange={handleEditChange} className="rxp-input" placeholder="City / District" />
                      </div>

                      <div className="rxp-btn-row">
                        <button className="rxp-btn-save" onClick={handleSaveProfile}>Save Changes</button>
                        <button className="rxp-btn-cancel" onClick={handleCancelEdit}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <div className="rxp-security-wrap">
                  <div className="rxp-security-title">
                    <Lock size={18} /> Change Password
                  </div>

                  <div className="rxp-field">
                    <label className="rxp-label">Current Password</label>
                    <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} className="rxp-input" placeholder="••••••••" />
                  </div>
                  <div className="rxp-field">
                    <label className="rxp-label">New Password</label>
                    <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} className="rxp-input" placeholder="••••••••" />
                  </div>
                  <div className="rxp-field">
                    <label className="rxp-label">Confirm New Password</label>
                    <input type="password" name="confirmNewPassword" value={passwordForm.confirmNewPassword} onChange={handlePasswordChange} className="rxp-input" placeholder="••••••••" />
                  </div>

                  <button className="rxp-btn-update" onClick={handlePasswordUpdate}>
                    Update Password
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

/* Helpers */
function InfoRow({ icon, label, value }) {
  return (
    <div className="rxp-info-row">
      <div className="rxp-info-icon">{icon}</div>
      <div>
        <div className="rxp-info-label">{label}</div>
        <div className="rxp-info-value">{value || "Not provided"}</div>
      </div>
    </div>
  );
}
