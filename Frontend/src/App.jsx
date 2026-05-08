import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Browse from './pages/Browse';
import MyBookings from './pages/MyBookings';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';
import AddProduct from './pages/AddProduct';
import NotificationPage from './pages/NotificationPage';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('login');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [notificationCount, setNotificationCount] = useState(0);

  const userRole = user?.role;
  const API_BASE_URL = "http://localhost:8086";

  useEffect(() => {
    if (user?.id) {
      loadNotificationCount(user.id);
    } else {
      setNotificationCount(0);
    }
  }, [user, activeTab]);

  const loadNotificationCount = async (userId) => {
    try {
      const notificationUserId = userRole === "ADMIN" ? "admin" : userId;

      const response = await axios.get(
        `${API_BASE_URL}/api/notifications/user/${notificationUserId}/unread-count`
      );

      if (response.data.success) {
        setNotificationCount(response.data.data);
      }
    } catch (error) {
      console.error("Notification Count Error:", error);
    }
  };

  const handleTabChange = (tab) => {
    if ((tab === "dashboard" || tab === "addProduct") && userRole !== "ADMIN") {
      alert("Only admin can access this page");
      setActiveTab("home");
      return;
    }

    if (tab === "profile" && userRole === "ADMIN") {
      setActiveTab("home");
      return;
    }

    setActiveTab(tab);
  };

  const handleLoginSuccess = () => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);

    setActiveTab("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");

    setUser(null);
    setNotificationCount(0);
    setActiveTab("home");
  };

  const showNavbar = activeTab !== 'login' && activeTab !== 'signup';
  const showFooter = activeTab !== 'login' && activeTab !== 'signup';

  return (
    <div className="min-h-screen bg-[#F8FCFC]">
      {showNavbar && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          userRole={userRole}
          notificationCount={notificationCount}
          onLogout={handleLogout}
        />
      )}

      <main>
        {activeTab === 'home' && (
          <Landing onStartBrowsing={() => setActiveTab('browse')} />
        )}

        {activeTab === 'browse' && <Browse />}

        {activeTab === 'bookings' && <MyBookings />}

        {activeTab === 'dashboard' && userRole === "ADMIN" && (
          <Dashboard setActiveTab={handleTabChange} />
        )}

        {activeTab === 'addProduct' && userRole === "ADMIN" && <AddProduct />}

        {activeTab === 'notifications' && userRole && <NotificationPage />}

        {activeTab === 'login' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'signup' && (
          <Signup
            onSignupSuccess={() => setActiveTab('login')}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'profile' && userRole !== "ADMIN" && <UserProfile />}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}