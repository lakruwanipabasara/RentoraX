import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookingCard from '../components/BookingItem';
import { CalendarClock, History, Package } from 'lucide-react';

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState('active');
  const [activeBookings, setActiveBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = "http://localhost:8086";

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser || !savedUser.id) { alert("Please login first"); return; }
    setIsLoading(true);
    try {
      const [activeResponse, pastResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/bookings/user/${savedUser.id}/active-upcoming`),
        axios.get(`${API_BASE_URL}/api/bookings/user/${savedUser.id}/past`)
      ]);
      if (activeResponse.data.success) setActiveBookings(activeResponse.data.data);
      if (pastResponse.data.success) setPastBookings(pastResponse.data.data);
    } catch (error) {
      console.error("Load Bookings Error:", error);
      alert("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestRent = async (bookingId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/bookings/${bookingId}/confirm`);
      if (response.data.success) { alert("Booking confirmed"); loadBookings(); }
      else alert(response.data.message || "Failed to confirm booking");
    } catch (error) {
      console.error("Confirm Booking Error:", error);
      alert("Failed to confirm booking");
    }
  };

  const tabs = [
    { key: 'active', label: 'Active & Upcoming', icon: <CalendarClock size={15} />, count: activeBookings.length },
    { key: 'past', label: 'Past Rentals', icon: <History size={15} />, count: pastBookings.length },
  ];

  const currentBookings = activeTab === 'active' ? activeBookings : pastBookings;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        .tab-btn { transition: background 0.18s, color 0.18s, box-shadow 0.18s; }
        .tab-btn.active { background: #0F6E56; color: #fff; box-shadow: 0 4px 14px rgba(15,110,86,0.25); }
        .tab-btn.inactive { background: #F0F9F6; color: #0F6E56; }
        .tab-btn.inactive:hover { background: #E1F5EE; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#FAFAF8', fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif", padding: '48px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Account</p>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '34px', fontWeight: 700, color: '#0D0D0D', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              My Bookings
            </h1>
            <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>Manage your current and past rentals</p>
          </div>

          {/* Summary Pills */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-btn ${activeTab === tab.key ? 'active' : 'inactive'}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '100px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {tab.icon}
                {tab.label}
                <span style={{
                  background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'rgba(15,110,86,0.12)',
                  borderRadius: '100px',
                  padding: '1px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  minWidth: '22px',
                  textAlign: 'center'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#bbb', fontSize: '15px' }}>Loading bookings…</div>
          ) : currentBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '20px', border: '1.5px dashed #E0DED8', color: '#ccc' }}>
              <Package size={36} style={{ marginBottom: '14px', opacity: 0.5 }} />
              <p style={{ fontSize: '15px', color: '#bbb', margin: 0 }}>
                {activeTab === 'active' ? 'No active or upcoming bookings.' : 'No past rentals yet.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onRequestRent={activeTab === 'active' ? (id) => handleRequestRent(id) : undefined}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}