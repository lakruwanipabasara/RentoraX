import React from 'react';

const COLOR_MAP = {
  teal:  { bg: '#E1F5EE', icon: '#0F6E56', border: '#9FE1CB', text: '#085041' },
  blue:  { bg: '#E6F1FB', icon: '#185FA5', border: '#B5D4F4', text: '#0C447C' },
  amber: { bg: '#FAEEDA', icon: '#BA7517', border: '#FAC775', text: '#633806' },
};

export default function FeatureCard({ icon, title, description, color }) {
  const c = COLOR_MAP[color] || COLOR_MAP.teal;

  return (
    <div style={{
      background: '#FAFAF8',
      borderRadius: '18px',
      border: '1px solid #ECEAE3',
      padding: '32px 28px',
      transition: 'background 0.2s, box-shadow 0.2s',
      fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    }}
      onMouseOver={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.07)'; }}
      onMouseOut={e => { e.currentTarget.style.background = '#FAFAF8'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{
        width: '44px', height: '44px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: c.icon,
        marginBottom: '20px',
        fontSize: '20px',
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#111', margin: '0 0 10px', letterSpacing: '-0.01em' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.65, margin: 0 }}>{description}</p>
    </div>
  );
}