import React, { useState } from 'react';
import axios from 'axios';
import { Search, Shield, Zap, Users, ArrowRight, MapPin, Star, TrendingUp, Package, ChevronRight } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

export default function Landing({ onStartBrowsing }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const API_BASE_URL = "http://localhost:8086";

  const features = [
    {
      icon: <Shield size={22} />,
      title: "Damage Protection",
      description: "Rent with peace of mind. Our optional protection covers up to $1,000 in accidental damages.",
      color: "teal"
    },
    {
      icon: <Zap size={22} />,
      title: "Instant Booking",
      description: "No more waiting for emails. Secure your gear instantly with our real-time availability calendar.",
      color: "blue"
    },
    {
      icon: <Users size={22} />,
      title: "Verified Community",
      description: "Every user is identity-verified to ensure a safe and trustworthy marketplace for everyone.",
      color: "amber"
    }
  ];

  const stats = [
    { value: "12,000+", label: "Active Listings" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "Rs. 0", label: "Listing Fee" },
    { value: "24/7", label: "Customer Support" },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/items/search?q=${searchQuery}`);
      if (response.data.success) {
        setSearchResults(response.data.data);
      } else {
        setSearchResults([]);
      }
      setHasSearched(true);
    } catch (error) {
      try {
        const allResponse = await axios.get(`${API_BASE_URL}/api/items`);
        if (allResponse.data.success) {
          const filtered = allResponse.data.data.filter(item =>
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSearchResults(filtered);
        }
        setHasSearched(true);
      } catch {
        setHasSearched(true);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif", background: '#FAFAF8' }}>

      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

      <style>{`
        .hero-grid { background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 32px 32px; }
        .item-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.10); }
        .item-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .search-pill { transition: box-shadow 0.2s ease; }
        .search-pill:focus-within { box-shadow: 0 0 0 3px rgba(15,110,86,0.15); }
        .stat-item:not(:last-child) { border-right: 1px solid rgba(255,255,255,0.15); }
        .feature-box:hover { background: #fff; box-shadow: 0 8px 32px rgba(0,0,0,0.07); }
        .feature-box { transition: background 0.2s ease, box-shadow 0.2s ease; }
        .tag-pill { background: rgba(15,110,86,0.1); color: #0F6E56; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; padding: 4px 10px; border-radius: 100px; text-transform: uppercase; }
      `}</style>

      {/* ── HERO ── */}
      <header style={{ background: 'linear-gradient(135deg, #0A3D2B 0%, #0F6E56 60%, #1D9E75 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-grid" style={{ position: 'absolute', inset: 0 }} />

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-120px', right: '120px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '90px 40px 60px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: '80px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '100px', padding: '6px 14px', marginBottom: '28px' }}>
                <TrendingUp size={13} />
                <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em' }}>Sri Lanka's #1 Rental Marketplace</span>
              </div>

              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(40px, 5vw, 62px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
                Rent Anything,<br />
                <span style={{ color: '#9FE1CB' }}>Anywhere.</span>
              </h1>

              <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: '0 0 40px', maxWidth: '460px' }}>
                The premium marketplace to rent professional cameras, drones, camping gear, and more — from trusted people in your community.
              </p>

              {/* Search Bar */}
              <div className="search-pill" style={{ display: 'flex', background: '#fff', borderRadius: '14px', overflow: 'hidden', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 18px', gap: '10px' }}>
                  <Search size={18} style={{ color: '#888', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search cameras, drones, tents…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#1a1a1a', background: 'transparent', padding: '16px 0' }}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  style={{ background: '#0F6E56', color: '#fff', border: 'none', padding: '0 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em', transition: 'background 0.2s' }}
                  onMouseOver={e => e.target.style.background = '#085041'}
                  onMouseOut={e => e.target.style.background = '#0F6E56'}
                >
                  {isSearching ? '...' : 'Search'}
                </button>
              </div>

              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '14px' }}>
                Popular: Cameras · Drones · Tents · Projectors · Power Tools
              </p>
            </div>

            {/* Stats block */}
            <div style={{ display: 'none' }} className="hero-stats" />
          </div>

          {/* Stats bar */}
          <div style={{ display: 'flex', marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '32px', gap: '0' }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-item" style={{ flex: 1, textAlign: 'center', padding: '0 20px' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginTop: '6px', fontWeight: 400 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── SEARCH RESULTS ── */}
      {hasSearched && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '36px' }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, margin: '0 0 6px', color: '#111' }}>
                Results for "{searchQuery}"
              </h2>
              <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>{searchResults.length} item{searchResults.length !== 1 ? 's' : ''} found</p>
            </div>
            <button
              onClick={onStartBrowsing}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid #0F6E56', color: '#0F6E56', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '20px', border: '1px dashed #e0e0d8' }}>
              <Package size={40} style={{ color: '#ccc', marginBottom: '16px' }} />
              <p style={{ fontSize: '17px', color: '#999', marginBottom: '24px' }}>No items matched your search.</p>
              <button
                onClick={onStartBrowsing}
                style={{ background: '#0F6E56', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              >
                Browse All Items
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {searchResults.map(item => (
                <SearchResultCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── FEATURES ── */}
      {!hasSearched && (
        <>
          <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 40px 60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <span className="tag-pill">Why Rentorax</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 700, margin: '18px 0 14px', color: '#111', letterSpacing: '-0.02em' }}>
                Built for Trust & Convenience
              </h2>
              <p style={{ fontSize: '16px', color: '#777', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
                We've built the safest and fastest way to share equipment within your local neighborhood.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {features.map((f, i) => (
                <div key={i} className="feature-box" style={{ background: '#F5F4F0', borderRadius: '18px', padding: '32px 28px', border: '1px solid #ECEAE3' }}>
                  <div style={{ width: '44px', height: '44px', background: '#E1F5EE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F6E56', marginBottom: '20px' }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#111', margin: '0 0 10px' }}>{f.title}</h3>
                  <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.65, margin: 0 }}>{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section style={{ background: '#fff', padding: '80px 40px', borderTop: '1px solid #ECEAE3', borderBottom: '1px solid #ECEAE3' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                <span className="tag-pill">Process</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 700, margin: '18px 0 14px', color: '#111', letterSpacing: '-0.02em' }}>
                  Renting in 3 Simple Steps
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', textAlign: 'center' }}>
                {[
                  { step: '01', title: 'Search & Discover', desc: 'Browse thousands of items available near you. Filter by category, price, and availability.' },
                  { step: '02', title: 'Book Instantly', desc: 'Select your rental period and confirm. Our real-time calendar shows what\'s available right now.' },
                  { step: '03', title: 'Pick Up & Go', desc: 'Coordinate directly with the owner. Return the item when done — it\'s that simple.' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 800, color: '#E1F5EE', lineHeight: 1, marginBottom: '16px' }}>{s.step}</div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111', margin: '0 0 10px' }}>{s.title}</h3>
                    <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section style={{ padding: '80px 40px', background: '#FAFAF8' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', background: 'linear-gradient(135deg, #0A3D2B 0%, #0F6E56 100%)', borderRadius: '28px', padding: '64px', textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
              <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '24px' }}>
                  For Item Owners
                </span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '38px', fontWeight: 700, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
                  Have Gear Sitting Idle?
                </h2>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.72)', marginBottom: '36px', lineHeight: 1.6 }}>
                  Join thousands of owners earning up to Rs. 50,000/month by listing their equipment.
                </p>
                <button
                  onClick={onStartBrowsing}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#0A3D2B', border: 'none', borderRadius: '100px', padding: '16px 32px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.01em' }}
                  onMouseOver={e => e.currentTarget.style.background = '#E1F5EE'}
                  onMouseOut={e => e.currentTarget.style.background = '#fff'}
                >
                  List Your Item <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #ECEAE3', padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F6E56', letterSpacing: '-0.01em' }}>Rentorax</div>
        <p style={{ fontSize: '13px', color: '#aaa', margin: 0 }}>© 2026 Rentorax. Built with React & Spring Boot.</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy', 'Terms', 'Support'].map(link => (
            <a key={link} href="#" style={{ fontSize: '13px', color: '#999', textDecoration: 'none' }}
              onMouseOver={e => e.target.style.color = '#0F6E56'}
              onMouseOut={e => e.target.style.color = '#999'}>
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

function SearchResultCard({ item }) {
  return (
    <div className="item-card" style={{ background: '#fff', borderRadius: '20px', border: '1px solid #ECEAE3', overflow: 'hidden', cursor: 'pointer' }}>
      <div style={{ height: '200px', background: '#F5F4F0', position: 'relative', overflow: 'hidden' }}>
        {item.image ? (
          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', flexDirection: 'column', gap: '8px' }}>
            <Package size={28} />
            <span style={{ fontSize: '12px' }}>No Image</span>
          </div>
        )}
        {item.category && (
          <span style={{ position: 'absolute', top: '14px', left: '14px', background: '#0A3D2B', color: '#9FE1CB', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {item.category}
          </span>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111', margin: '0 0 6px', lineHeight: 1.3 }}>{item.title}</h3>
        <p style={{ fontSize: '13px', color: '#999', margin: '0 0 14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#aaa', marginBottom: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} style={{ color: '#0F6E56' }} />
            {item.location || 'Location N/A'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={12} style={{ color: '#EF9F27', fill: '#EF9F27' }} />
            {item.rating || 'N/A'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0EEE8', paddingTop: '14px' }}>
          <div>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#0F6E56' }}>Rs. {item.price}</span>
            <span style={{ fontSize: '12px', color: '#bbb' }}>/day</span>
          </div>
          {item.deposit && <span style={{ fontSize: '11px', color: '#bbb' }}>Rs. {item.deposit} deposit</span>}
        </div>
      </div>
    </div>
  );
}