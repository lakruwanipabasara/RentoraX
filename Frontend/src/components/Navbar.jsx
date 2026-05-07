import React from 'react';
import {
  Home, Calendar, User, LayoutDashboard,
  PlusCircle, Bell, LogOut, Package
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, userRole, notificationCount, onLogout }) {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap" rel="stylesheet" />

      <style>{`
        .nav-btn {
          transition: background 0.18s, color 0.18s, transform 0.15s;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
        }

        .nav-btn.active {
          background: #0F6E56;
          color: #fff;
          box-shadow: 0 4px 14px rgba(15,110,86,0.28);
        }

        .nav-btn.inactive {
          color: #5A6A65;
          background: transparent;
        }

        .nav-btn.inactive:hover {
          background: #EDF7F3;
          color: #0F6E56;
        }

        .notif-btn.active {
          background: #0F6E56;
          color: #fff;
          box-shadow: 0 4px 14px rgba(15,110,86,0.28);
        }

        .notif-btn.inactive {
          color: #5A6A65;
          background: transparent;
        }

        .notif-btn.inactive:hover {
          background: #EDF7F3;
          color: #0F6E56;
        }

        .logout-btn {
          transition: background 0.18s, color 0.18s;
          font-family: 'DM Sans', sans-serif;
        }

        .logout-btn:hover {
          background: #FFF0F0 !important;
          color: #C0392B !important;
        }

        .login-btn {
          transition: background 0.18s, color 0.18s;
        }

        .login-btn:hover {
          background: #DFF3EC !important;
          color: #085041 !important;
        }

        .signup-btn {
          transition: background 0.18s, box-shadow 0.18s;
        }

        .signup-btn:hover {
          background: #085041 !important;
          box-shadow: 0 4px 14px rgba(15,110,86,0.32) !important;
        }

        .logo-wrap {
          transition: transform 0.2s;
        }

        .logo-wrap:hover {
          transform: scale(1.03);
        }

        .nav-divider {
          width: 1px;
          height: 22px;
          background: #E4E2DA;
          margin: 0 6px;
          flex-shrink: 0;
        }

        .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #E24B4A;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
          line-height: 1;
        }
      `}</style>

      <nav
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #ECEAE3',
          padding: '0 56px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: '104px',
          fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
          boxShadow: '0 1px 0 #ECEAE3, 0 4px 24px rgba(0,0,0,0.04)'
        }}
      >
        {/* Logo only */}
        <div
          className="logo-wrap"
          onClick={() => setActiveTab('home')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
            width: '300px'
          }}
        >
          <img
            src="/rentorax-logo.png"
            alt="RentoraX Logo"
            style={{
              width: '280px',
              height: '90px',
              objectFit: 'contain',
              display: 'block'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              document.getElementById('logo-fallback').style.display = 'flex';
            }}
          />

          <div
            id="logo-fallback"
            style={{
              display: 'none',
              width: '76px',
              height: '76px',
              background: 'linear-gradient(135deg, #0F6E56 0%, #1AA87A 100%)',
              borderRadius: '18px',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(15,110,86,0.3)'
            }}
          >
            <Package size={38} color="#fff" strokeWidth={2} />
          </div>
        </div>

        {/* Nav Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <NavBtn
            icon={<Home size={15} />}
            label="Browse"
            active={activeTab === 'browse'}
            onClick={() => setActiveTab('browse')}
          />

          {userRole === "ADMIN" ? (
            <>
              <NavBtn
                icon={<PlusCircle size={15} />}
                label="Add Product"
                active={activeTab === 'addProduct'}
                onClick={() => setActiveTab('addProduct')}
              />

              <NavBtn
                icon={<LayoutDashboard size={15} />}
                label="Dashboard"
                active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
              />

              <NavBtn
                icon={<Calendar size={15} />}
                label="Bookings"
                active={activeTab === 'bookings'}
                onClick={() => setActiveTab('bookings')}
              />
            </>
          ) : (
            <>
              <NavBtn
                icon={<Calendar size={15} />}
                label="My Bookings"
                active={activeTab === 'bookings'}
                onClick={() => setActiveTab('bookings')}
              />

              {userRole && (
                <NavBtn
                  icon={<User size={15} />}
                  label="Profile"
                  active={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                />
              )}
            </>
          )}

          {userRole && (
            <button
              onClick={() => setActiveTab('notifications')}
              className={`nav-btn notif-btn ${activeTab === 'notifications' ? 'active' : 'inactive'}`}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 16px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Bell size={15} />
              <span>Notifications</span>

              {notificationCount > 0 && (
                <span className="badge">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
          )}

          <div className="nav-divider" />

          {userRole ? (
            <button
              className="logout-btn"
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 16px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                color: '#7A8C88',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                className="login-btn"
                onClick={() => setActiveTab('login')}
                style={{
                  padding: '9px 20px',
                  borderRadius: '10px',
                  border: '1.5px solid #D4EDE5',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F6E56',
                  background: '#F4FCF9',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Log In
              </button>

              <button
                className="signup-btn"
                onClick={() => setActiveTab('signup')}
                style={{
                  padding: '9px 22px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #0F6E56 0%, #1AA87A 100%)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 3px 10px rgba(15,110,86,0.25)',
                  letterSpacing: '0.01em'
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

function NavBtn({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`nav-btn ${active ? 'active' : 'inactive'}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '9px 16px',
        borderRadius: '10px',
        border: 'none',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer'
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}