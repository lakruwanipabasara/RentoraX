import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, Clock, Info, AlertCircle, Package } from 'lucide-react';

const TYPE_CONFIG = {
  RENT_REQUEST:   { label: 'Rent Request',   bg: '#E1F5EE', color: '#085041', dot: '#1D9E75' },
  CONFIRMED:      { label: 'Confirmed',       bg: '#E6F1FB', color: '#0C447C', dot: '#378ADD' },
  RETURN_REMINDER:{ label: 'Return Reminder', bg: '#FAEEDA', color: '#633806', dot: '#EF9F27' },
  APPROVED:       { label: 'Approved',        bg: '#EAF3DE', color: '#27500A', dot: '#639922' },
  DEFAULT:        { label: 'Notification',    bg: '#F1EFE8', color: '#444441', dot: '#888780' },
};

function TypeBadge({ type }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.DEFAULT;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: cfg.bg, color: cfg.color,
      fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
      textTransform: 'uppercase', padding: '4px 10px', borderRadius: '100px'
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = "http://localhost:8086";
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = savedUser?.role;

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    if (!savedUser || !savedUser.id) { alert("Please login first"); return; }
    setIsLoading(true);
    try {
      const notificationUserId = userRole === "ADMIN" ? "admin" : savedUser.id;
      const response = await axios.get(`${API_BASE_URL}/api/notifications/user/${notificationUserId}`);
      if (response.data.success) setNotifications(response.data.data);
      await axios.put(`${API_BASE_URL}/api/notifications/user/${notificationUserId}/read-all`);
    } catch (error) {
      console.error("Notification Load Error:", error);
      alert("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/bookings/${bookingId}/approve`);
      if (response.data.success) { alert("Order approved successfully"); loadNotifications(); }
      else alert(response.data.message);
    } catch (error) {
      console.error("Approve Error:", error);
      alert("Failed to approve order");
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        .notif-card { transition: box-shadow 0.2s, border-color 0.2s; }
        .notif-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.06); }
        .approve-btn { transition: background 0.2s; }
        .approve-btn:hover { background: #085041 !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#FAFAF8', fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif", padding: '48px 40px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Inbox</p>
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '34px', fontWeight: 700, color: '#0D0D0D', margin: '0 0 6px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
                Notifications
                {unreadCount > 0 && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#0F6E56', color: '#fff', fontSize: '13px', fontWeight: 700, minWidth: '26px', height: '26px', borderRadius: '100px', padding: '0 8px' }}>
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>Rental requests, confirmations, and reminders</p>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#bbb', fontSize: '15px' }}>Loading notifications…</div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '20px', border: '1.5px dashed #E0DED8' }}>
              <Bell size={36} style={{ color: '#ddd', marginBottom: '14px' }} />
              <p style={{ fontSize: '15px', color: '#bbb', margin: 0 }}>You're all caught up. No notifications.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="notif-card"
                  style={{
                    background: '#fff',
                    borderRadius: '18px',
                    border: `1px solid ${notification.read ? '#ECEAE3' : '#9FE1CB'}`,
                    padding: '20px 24px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Unread accent stripe */}
                  {!notification.read && (
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#1D9E75', borderRadius: '18px 0 0 18px' }} />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111', margin: 0 }}>{notification.title}</h3>
                        <TypeBadge type={notification.type} />
                      </div>
                      <p style={{ fontSize: '14px', color: '#888', margin: '0 0 12px', lineHeight: 1.55 }}>{notification.message}</p>

                      {notification.createdAt && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#bbb' }}>
                          <Clock size={12} />
                          {new Date(notification.createdAt).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {userRole === "ADMIN" && notification.type === "RENT_REQUEST" && notification.bookingId && (
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(notification.bookingId)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
                      >
                        <CheckCircle size={15} />
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}