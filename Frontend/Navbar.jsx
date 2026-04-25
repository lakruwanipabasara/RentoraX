import React from 'react';
import { Home, Calendar, MapPin, LayoutDashboard } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Clicking the Logo takes you back to Landing (Home) */}
      <div 
        className="text-2xl font-bold text-teal-800 cursor-pointer" 
        onClick={() => setActiveTab('home')}
      >
        RentHub
      </div>

      <div className="flex gap-4 items-center">
        <NavButton 
          icon={<Home size={18}/>} 
          label="Browse" 
          active={activeTab === 'browse'} 
          onClick={() => setActiveTab('browse')}
        />
        <NavButton 
          icon={<Calendar size={18}/>} 
          label="My Bookings" 
          active={activeTab === 'bookings'} 
          onClick={() => setActiveTab('bookings')}
        />
        <NavButton 
          icon={<MapPin size={18}/>} 
          label="Nearby" 
          active={activeTab === 'nearby'} 
          onClick={() => setActiveTab('nearby')}
        />
        <NavButton 
          icon={<LayoutDashboard size={18}/>} 
          label="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
        />
      </div>
    </nav>
  );
}

// Helper component for Nav buttons
function NavButton({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
        active 
          ? 'bg-teal-800 text-white shadow-md' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-teal-700'
      }`}
    >
      {icon} 
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}