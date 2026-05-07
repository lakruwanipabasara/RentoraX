import React, { useState } from 'react';
import axios from 'axios';

export default function Signup({ onSignupSuccess, setActiveTab }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.email.toLowerCase() === "admin@gmail.com") {
      alert("This email is reserved for admin");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8086/api/auth/register", form);
      if (response.data.success) {
        alert(response.data.message);
        onSignupSuccess && onSignupSuccess();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .rx-signup-root {
          min-height: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          background: #f5f4f0;
          padding: 48px 24px;
        }

        .rx-signup-wrapper {
          display: flex;
          width: 100%;
          max-width: 980px;
          gap: 48px;
          align-items: flex-start;
        }

        .rx-signup-sidebar {
          display: none;
          flex: 0 0 300px;
          position: sticky;
          top: 48px;
        }

        @media (min-width: 900px) {
          .rx-signup-sidebar { display: block; }
        }

        .rx-signup-sidebar-inner {
          background: #0d3d36;
          border-radius: 24px;
          padding: 40px 32px;
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .rx-signup-sidebar-inner::before {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(104,211,145,0.14) 0%, transparent 70%);
          top: -80px;
          right: -80px;
        }

        .rx-sidebar-brand {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          margin-bottom: 36px;
          display: inline-flex;
          align-items: center;
          gap: 0;
        }

        .rx-sidebar-brand-logo {
          width: 250px;
          height:100px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .rx-sidebar-brand-fallback {
          width: 150px;
          height: 100px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #ffffff;
          background: linear-gradient(135deg, rgba(104,211,145,0.55), rgba(15,122,98,0.95));
          letter-spacing: 0.04em;
        }

        .rx-signup-mobile-brand {
          display: inline-flex;
          align-items: center;
          gap: 0;
          margin-bottom: 14px;
        }

        .rx-signup-mobile-brand-logo {
          width: 84px;
          height: 84px;
          object-fit: contain;
        }

        .rx-signup-mobile-brand-fallback {
          width: 84px;
          height: 84px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: #ffffff;
          background: linear-gradient(135deg, #0d3d36, #0d7a62);
          letter-spacing: 0.04em;
        }

        .rx-sidebar-headline {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          line-height: 1.2;
          margin-bottom: 16px;
        }

        .rx-sidebar-headline em {
          color: #68d391;
          font-style: normal;
        }

        .rx-sidebar-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          margin-bottom: 36px;
        }

        .rx-perk {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .rx-perk-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(104,211,145,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        .rx-perk-text {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
        }

        .rx-perk-text strong {
          display: block;
          color: #fff;
          font-weight: 600;
          margin-bottom: 2px;
        }

        /* Form Card */
        .rx-signup-card {
          flex: 1;
          background: #fff;
          border-radius: 24px;
          padding: 44px 40px;
          border: 1px solid #eae9e3;
          box-shadow: 0 2px 24px rgba(0,0,0,0.04);
        }

        @media (max-width: 600px) {
          .rx-signup-card { padding: 28px 20px; }
        }

        @media (min-width: 900px) {
          .rx-signup-mobile-brand { display: none; }
        }

        .rx-signup-card h2 {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 700;
          color: #0d3d36;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .rx-signup-card > p {
          font-size: 14px;
          color: #8a9ba8;
          margin-bottom: 36px;
        }

        .rx-section-label {
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

        .rx-section-label:first-of-type {
          margin-top: 0;
        }

        .rx-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 580px) {
          .rx-grid-2 { grid-template-columns: 1fr; }
        }

        .rx-field {
          margin-bottom: 16px;
        }

        .rx-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #0d3d36;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .rx-input {
          width: 100%;
          padding: 13px 15px;
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

        .rx-input:focus {
          border-color: #0d3d36;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(13,61,54,0.06);
        }

        .rx-input::placeholder { color: #c0bdb5; }

        .rx-optional {
          font-size: 11px;
          color: #aaa;
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
          margin-left: 4px;
        }

        .rx-btn-primary {
          width: 100%;
          padding: 15px;
          background: #0d3d36;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 28px;
          transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 16px rgba(13,61,54,0.18);
        }

        .rx-btn-primary:hover {
          background: #0a2e29;
          box-shadow: 0 6px 20px rgba(13,61,54,0.26);
        }

        .rx-btn-primary:active { transform: scale(0.99); }
        .rx-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .rx-footer-text {
          text-align: center;
          font-size: 13px;
          color: #8a9ba8;
          margin-top: 24px;
        }

        .rx-link {
          color: #0d7a62;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }

        .rx-link:hover { color: #0d3d36; }
      `}</style>

      <div className="rx-signup-root">
        <div className="rx-signup-wrapper">

          {/* Sidebar */}
          <aside className="rx-signup-sidebar">
            <div className="rx-signup-sidebar-inner">
              <div className="rx-sidebar-brand">
                {!logoError ? (
                  <img
                    src="/rentorax-logo.png"
                    alt="RentoraX"
                    className="rx-sidebar-brand-logo"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="rx-sidebar-brand-fallback">RX</div>
                )}
              </div>
              <div className="rx-sidebar-headline">Start your rental journey <em>today.</em></div>
              <p className="rx-sidebar-sub">
                Join thousands of customers discovering smarter ways to rent.
              </p>
              <div className="rx-perk">
                <div className="rx-perk-icon">🔒</div>
                <div className="rx-perk-text">
                  <strong>Secure & Private</strong>
                  Your data is encrypted and never shared.
                </div>
              </div>
              <div className="rx-perk">
                <div className="rx-perk-icon">⚡</div>
                <div className="rx-perk-text">
                  <strong>Instant Access</strong>
                  Browse listings the moment you sign up.
                </div>
              </div>
              <div className="rx-perk">
                <div className="rx-perk-icon">💬</div>
                <div className="rx-perk-text">
                  <strong>24/7 Support</strong>
                  We're here whenever you need us.
                </div>
              </div>
            </div>
          </aside>

          {/* Form Card */}
          <div className="rx-signup-card">
            <div className="rx-signup-mobile-brand">
              {!logoError ? (
                <img
                  src="/rentorax-logo.png"
                  alt="RentoraX"
                  className="rx-signup-mobile-brand-logo"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="rx-signup-mobile-brand-fallback">RX</div>
              )}
            </div>

            <h2>Create Account</h2>
            <p>Fill in your details to get started with RentoraX</p>

            <form onSubmit={handleSubmit}>
              <div className="rx-section-label">Personal Information</div>

              <div className="rx-grid-2">
                <div className="rx-field">
                  <label className="rx-label">Full Name</label>
                  <input type="text" name="name" placeholder="Jane Doe" value={form.name} onChange={handleChange} className="rx-input" required />
                </div>
                <div className="rx-field">
                  <label className="rx-label">Phone</label>
                  <input type="tel" name="phone" placeholder="+94 77 000 0000" value={form.phone} onChange={handleChange} className="rx-input" required />
                </div>
              </div>

              <div className="rx-field">
                <label className="rx-label">Email Address</label>
                <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} className="rx-input" required />
              </div>

              <div className="rx-section-label">Address</div>

              <div className="rx-field">
                <label className="rx-label">Street Address</label>
                <input type="text" name="addressLine1" placeholder="123 Main Street" value={form.addressLine1} onChange={handleChange} className="rx-input" required />
              </div>

              <div className="rx-field">
                <label className="rx-label">Apartment / Building <span className="rx-optional">(optional)</span></label>
                <input type="text" name="addressLine2" placeholder="Unit 4B, Floor 2…" value={form.addressLine2} onChange={handleChange} className="rx-input" />
              </div>

              <div className="rx-field">
                <label className="rx-label">City / District</label>
                <input type="text" name="addressLine3" placeholder="Colombo" value={form.addressLine3} onChange={handleChange} className="rx-input" required />
              </div>

              <div className="rx-section-label">Security</div>

              <div className="rx-grid-2">
                <div className="rx-field">
                  <label className="rx-label">Password</label>
                  <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} className="rx-input" required />
                </div>
                <div className="rx-field">
                  <label className="rx-label">Confirm Password</label>
                  <input type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} className="rx-input" required />
                </div>
              </div>

              <button type="submit" className="rx-btn-primary" disabled={loading}>
                {loading ? 'Creating Account…' : 'Create Account →'}
              </button>
            </form>

            <p className="rx-footer-text">
              Already have an account?{' '}
              <span className="rx-link" onClick={() => setActiveTab && setActiveTab('login')}>Sign in</span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}