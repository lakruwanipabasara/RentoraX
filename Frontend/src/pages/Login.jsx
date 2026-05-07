import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLoginSuccess, setActiveTab }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8086/api/auth/login", form);
      if (response.data.success) {
        if (form.rememberMe) localStorage.setItem('userEmail', form.email);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        alert(response.data.message);
        const loggedUser = response.data.data;
        if (loggedUser.role === "ADMIN") {
          setActiveTab && setActiveTab("dashboard");
        } else {
          onLoginSuccess && onLoginSuccess();
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .rx-login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 28px 20px;
          font-family: 'DM Sans', sans-serif;
          background:
            radial-gradient(circle at top left, rgba(13,61,54,0.08), transparent 30%),
            radial-gradient(circle at bottom right, rgba(104,211,145,0.12), transparent 35%),
            linear-gradient(180deg, #f8faf7 0%, #f4f2ec 100%);
        }

        @media (max-width: 899px) {
          .rx-login-root {
            min-height: auto;
            padding: 20px 16px 28px;
          }
        }

        .rx-login-left {
          display: none !important;
        }

        .rx-login-right {
          width: 100%;
          max-width: 560px;
          min-height: auto;
          padding: 0;
          background: transparent;
          backdrop-filter: none;
          border-radius: 0;
        }

        .rx-brand {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          color: #0d3d36;
          letter-spacing: -0.5px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .rx-brand-logo {
          width: 150px;
          height: 100px;
          object-fit: contain;
          filter: none;
          opacity: 1;
          flex-shrink: 0;
        }

        .rx-brand-name span {
          color: #68d391;
        }

        .rx-login-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          background: transparent;
          backdrop-filter: none;
          border-radius: 0;
        }

        .rx-login-card {
          width: 100%;
          max-width: 560px;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(229,231,223,0.95);
          border-radius: 30px;
          padding: 46px 42px;
          box-shadow:
            0 20px 56px rgba(13,61,54,0.10),
            0 4px 14px rgba(13,61,54,0.05);
        }

        @media (max-width: 899px) {
          .rx-login-card {
            padding: 30px 22px;
            border-radius: 24px;
          }
        }

        .rx-login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 24px;
        }

        .rx-login-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          margin-bottom: 18px;
          border-radius: 999px;
          background: rgba(13,61,54,0.06);
          color: #0d7a62;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .rx-login-kicker::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0d7a62;
          box-shadow: 0 0 0 4px rgba(13,122,98,0.10);
        }

        .rx-mobile-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .rx-mobile-brand-logo {
          width: 250px;
          height: 100px;
          object-fit: contain;
        }

        .rx-mobile-brand-text {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          color: #0d3d36;
          line-height: 1;
        }

        .rx-mobile-brand-text span {
          color: #0d7a62;
        }

        .rx-login-card h2 {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          color: #0d3d36;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .rx-login-card p {
          font-size: 14px;
          color: #6f7f89;
          margin-bottom: 30px;
          line-height: 1.65;
        }

        .rx-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #0d3d36;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .rx-input {
          width: 100%;
          padding: 15px 16px;
          border: 1.5px solid #dfe5de;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1a1a;
          background: rgba(255,255,255,0.92);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .rx-input:focus {
          border-color: #0d3d36;
          box-shadow: 0 0 0 4px rgba(13,61,54,0.06);
        }

        .rx-input::placeholder {
          color: #bbb;
        }

        .rx-field {
          margin-bottom: 20px;
        }

        .rx-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          margin-top: -2px;
        }

        .rx-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #52606d;
          cursor: pointer;
        }

        .rx-remember input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #0d3d36;
          cursor: pointer;
        }

        .rx-forgot {
          font-size: 13px;
          font-weight: 600;
          color: #0d7a62;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s;
          white-space: nowrap;
        }

        .rx-forgot:hover {
          color: #0d3d36;
        }

        .rx-btn-primary {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #0d3d36 0%, #0f6e56 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
          letter-spacing: 0.02em;
          box-shadow: 0 10px 26px rgba(13,61,54,0.18);
        }

        .rx-btn-primary:hover {
          filter: brightness(1.03);
          box-shadow: 0 14px 30px rgba(13,61,54,0.24);
        }

        .rx-btn-primary:active {
          transform: scale(0.99);
        }

        .rx-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .rx-footer-text {
          text-align: center;
          font-size: 13px;
          color: #6f7f89;
          margin-top: 26px;
        }

        .rx-link {
          color: #0d7a62;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }

        .rx-link:hover {
          color: #0d3d36;
        }

        .rx-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0;
        }

        .rx-divider-line {
          flex: 1;
          height: 1px;
          background: #e4e4dc;
        }

        .rx-divider-text {
          font-size: 12px;
          color: #aaa;
          font-weight: 500;
        }
      `}</style>

      <div className="rx-login-root">
        <div className="rx-login-right">
          <div className="rx-login-card">
            <div className="rx-login-header">
              <div className="rx-mobile-brand">
                {!logoError ? (
                  <img
                    src="/rentorax-logo.png"
                    alt="RentoraX"
                    className="rx-mobile-brand-logo"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div
                    className="rx-mobile-brand-logo"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', background: 'rgba(13,61,54,0.08)', color: '#0d3d36', fontSize: '18px', fontWeight: 700 }}
                  >
                    RX
                  </div>
                )}
              </div>
              <h2>Welcome back</h2>
              <p>Sign in to continue to your RentoraX account</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="rx-field">
                <label className="rx-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="rx-input"
                  required
                />
              </div>

              <div className="rx-field">
                <label className="rx-label">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="rx-input"
                  required
                />
              </div>

              <div className="rx-row">
                <label className="rx-remember">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={form.rememberMe}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
                <span className="rx-forgot" onClick={() => alert("Forgot Password feature coming soon")}>
                  Forgot password?
                </span>
              </div>

              <button type="submit" className="rx-btn-primary" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="rx-footer-text">
              Don't have an account?{' '}
              <span className="rx-link" onClick={() => setActiveTab && setActiveTab('signup')}>
                Create one
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}