
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Browse from './pages/Browse';
import MyBookings from './pages/MyBookings';
import Landing from './pages/Landing';
import Nearby from './pages/Nearby'; // Import the new Nearby component
import Dashboard from './pages/Dashboard'; // Import the Dashboard component

export default function App() {
  // Navigation state
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-[#F8FCFC]">
      {/* Navbar controls the activeTab state */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main>
        {/* Conditional Rendering based on activeTab */}
        {activeTab === 'home' && (
          <Landing onStartBrowsing={() => setActiveTab('browse')} />
        )}
        
        {activeTab === 'browse' && <Browse />}
        
        {activeTab === 'bookings' && <MyBookings />}

        {/* This will now render your Split-Screen Map & List (SS9-12) */}
        {activeTab === 'nearby' && <Nearby />}

        {/* Dashboard Placeholder */}
        {activeTab === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}