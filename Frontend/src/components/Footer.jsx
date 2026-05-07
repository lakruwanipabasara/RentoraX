import React from 'react';
import { MapPin, Mail, Phone, Package, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&display=swap" rel="stylesheet" />

      <style>{`
        :root {
          --forest:   #0B3D2E;
          --emerald:  #0F6E56;
          --jade:     #1AA87A;
          --mint:     #9FE1CB;
          --cream:    #F7F5F0;
          --surface:  #FFFFFF;
          --border:   #E4EDE9;
          --text-1:   #0B1F18;
          --text-2:   #4D6E65;
          --text-3:   #8BA49C;
        }

        .rx-footer {
          background: linear-gradient(180deg, #0C3D2F 0%, #082B20 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        /* Subtle background texture */
        .rx-footer::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 20% 20%, rgba(26,168,122,0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(15,110,86,0.10) 0%, transparent 50%);
          pointer-events: none;
        }

        .rx-footer-grid-bg {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(159,225,203,0.06) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
        }

        .rx-footer-inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 72px 48px 0;
        }

        /* ── Top section ── */
        .rx-footer-top {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
          gap: 56px;
          padding-bottom: 56px;
          border-bottom: 1px solid rgba(159,225,203,0.14);
        }

        @media (max-width: 1024px) {
          .rx-footer-top { grid-template-columns: 1fr 1fr; gap: 36px; }
          .rx-footer-inner { padding: 56px 28px 0; }
        }

        @media (max-width: 640px) {
          .rx-footer-top { grid-template-columns: 1fr; gap: 32px; }
          .rx-footer-inner { padding: 48px 20px 0; }
        }

        /* Brand column */
        .rx-footer-brand-desc {
          font-size: 14px;
          color: rgba(159,225,203,0.65);
          line-height: 1.75;
          margin: 0 0 28px;
          max-width: 280px;
          font-weight: 300;
        }

        .rx-footer-logo-fallback {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .rx-footer-logo-mark {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, var(--emerald) 0%, var(--jade) 100%);
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(26,168,122,0.25);
          flex-shrink: 0;
        }

        .rx-footer-logo-text {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .rx-footer-logo-sub {
          display: block;
          font-family: 'Sora', sans-serif;
          font-size: 9px;
          font-weight: 500;
          color: var(--mint);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 3px;
        }

        .rx-footer-logo-img {
          width: 180px;
          height: 60px;
          object-fit: contain;
          display: block;
          margin-bottom: 20px;
          filter: brightness(0) invert(1);
          opacity: 0.9;
        }

        /* Socials */
        .rx-socials {
          display: flex;
          gap: 10px;
        }

        .rx-social-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid rgba(159,225,203,0.2);
          background: rgba(159,225,203,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(159,225,203,0.65);
          cursor: pointer;
          transition: all 0.22s;
        }

        .rx-social-btn:hover {
          background: var(--jade);
          border-color: var(--jade);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(26,168,122,0.32);
        }

        /* Column headings */
        .rx-footer-col-title {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--mint);
          margin: 0 0 22px;
        }

        /* Link lists */
        .rx-footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .rx-footer-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          font-family: inherit;
          transition: color 0.18s;
          letter-spacing: -0.01em;
        }

        .rx-footer-link:hover {
          color: var(--mint);
        }

        .rx-footer-link-icon {
          opacity: 0;
          transform: translate(-4px, 4px);
          transition: all 0.18s;
          color: var(--jade);
        }

        .rx-footer-link:hover .rx-footer-link-icon {
          opacity: 1;
          transform: translate(0, 0);
        }

        /* Contact items */
        .rx-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          line-height: 1.6;
          letter-spacing: -0.01em;
        }

        .rx-contact-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(26,168,122,0.12);
          border: 1px solid rgba(26,168,122,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--jade);
        }

        /* Hours card */
        .rx-hours-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(159,225,203,0.14);
          border-radius: 16px;
          padding: 22px;
          backdrop-filter: blur(8px);
        }

        .rx-hours-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--jade);
          margin: 0 0 6px;
        }

        .rx-hours-time {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .rx-hours-note {
          font-size: 12px;
          color: rgba(255,255,255,0.38);
          margin: 0 0 18px;
          font-weight: 300;
          line-height: 1.5;
        }

        .rx-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2ECC71;
          box-shadow: 0 0 0 4px rgba(46,204,113,0.18);
          display: inline-block;
          flex-shrink: 0;
        }

        .rx-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(46,204,113,0.10);
          border: 1px solid rgba(46,204,113,0.22);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #2ECC71;
        }

        /* ── Middle divider bar ── */
        .rx-footer-mid {
          position: relative;
          z-index: 1;
          padding: 18px 48px;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .rx-footer-mid-line {
          flex: 1;
          height: 1px;
          background: rgba(159,225,203,0.1);
        }

        .rx-footer-mid-text {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(159,225,203,0.35);
          white-space: nowrap;
        }

        /* ── Bottom bar ── */
        .rx-footer-bottom {
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(159,225,203,0.08);
          max-width: 1280px;
          margin: 0 auto;
          padding: 22px 48px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
        }

        @media (max-width: 640px) {
          .rx-footer-mid { padding: 18px 20px; }
          .rx-footer-bottom { padding: 20px 20px 24px; flex-direction: column; align-items: flex-start; }
        }

        .rx-footer-copy {
          font-size: 13px;
          color: rgba(255,255,255,0.28);
          margin: 0;
          font-weight: 300;
          letter-spacing: -0.01em;
        }

        .rx-footer-legal {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .rx-footer-legal-link {
          font-size: 12px;
          color: rgba(255,255,255,0.32);
          text-decoration: none;
          font-weight: 400;
          letter-spacing: -0.01em;
          transition: color 0.18s;
        }

        .rx-footer-legal-link:hover {
          color: var(--mint);
        }

        /* Bottom accent line */
        .rx-footer-accent {
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--jade) 40%, var(--mint) 60%, transparent);
          opacity: 0.3;
        }
      `}</style>

      <div className="rx-footer">
        <div className="rx-footer-grid-bg" />

        {/* ── Top grid ── */}
        <div className="rx-footer-inner">
          <div className="rx-footer-top">

            {/* Brand */}
            <div>
              <img
                src="/rentorax-logo.png"
                alt="RentoraX"
                className="rx-footer-logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  document.getElementById('rx-footer-fb').style.display = 'flex';
                }}
              />
              <div id="rx-footer-fb" style={{ display: 'none' }} className="rx-footer-logo-fallback">
                <div className="rx-footer-logo-mark">
                  <Package size={22} color="#fff" strokeWidth={2.2} />
                </div>
                <div>
                  <span className="rx-footer-logo-text">RentoraX</span>
                  <span className="rx-footer-logo-sub">Sri Lanka's Rental Hub</span>
                </div>
              </div>

              <p className="rx-footer-brand-desc">
                Sri Lanka's premium platform for renting electronics, tools, cameras, and everyday essentials — from people you can trust.
              </p>

              <div className="rx-socials">
                {[
                  { icon: 'F', label: 'Facebook' },
                  { icon: 'X', label: 'Twitter' },
                  { icon: 'in', label: 'LinkedIn' },
                ].map(s => (
                  <button key={s.label} title={s.label} className="rx-social-btn">
                    <span style={{ fontSize: s.icon === 'in' ? '12px' : '13px', fontWeight: 700, lineHeight: 1 }}>{s.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p className="rx-footer-col-title">Quick Links</p>
              <ul className="rx-footer-links">
                {['Browse Items', 'How It Works', 'List Your Item', 'My Bookings', 'FAQs'].map(link => (
                  <li key={link}>
                    <a href="#" className="rx-footer-link">
                      {link}
                      <ArrowUpRight size={12} className="rx-footer-link-icon" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="rx-footer-col-title">Contact</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="rx-contact-item">
                  <div className="rx-contact-icon"><MapPin size={14} /></div>
                  <span>409/1/A, Piliyandala Road,<br />Maharagama, Sri Lanka</span>
                </div>
                <div className="rx-contact-item" style={{ alignItems: 'center' }}>
                  <div className="rx-contact-icon"><Phone size={14} /></div>
                  <span>+94 76 310 3104</span>
                </div>
                <div className="rx-contact-item" style={{ alignItems: 'center' }}>
                  <div className="rx-contact-icon"><Mail size={14} /></div>
                  <span>hello@rentorax.lk</span>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div>
              <p className="rx-footer-col-title">Working Hours</p>
              <div className="rx-hours-card">
                <p className="rx-hours-label">Open Every Day</p>
                <p className="rx-hours-time">9:00 AM – 5:00 PM</p>
                <p className="rx-hours-note">Support available including public holidays.</p>
                <div className="rx-status-badge">
                  <span className="rx-status-dot" />
                  Currently Open
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tagline divider ── */}
        <div className="rx-footer-mid">
          <div className="rx-footer-mid-line" />
          <span className="rx-footer-mid-text">Next-Gen Renting, Made Simple</span>
          <div className="rx-footer-mid-line" />
        </div>

        {/* ── Bottom bar ── */}
        <div className="rx-footer-bottom">
          <p className="rx-footer-copy">
            © {year} RentoraX (Pvt) Ltd. All rights reserved.
          </p>
          <div className="rx-footer-legal">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
              <a key={link} href="#" className="rx-footer-legal-link">{link}</a>
            ))}
          </div>
        </div>

        {/* Bottom accent */}
        <div className="rx-footer-accent" />
      </div>
    </footer>
  );
}