import React from 'react';
import { Clock, ShieldCheck, Calendar, DollarSign, CheckCircle, Package, ArrowRight } from 'lucide-react';

const STATUS_CONFIG = {
  Pending:   { bg: '#FAEEDA', color: '#633806', dot: '#EF9F27', label: 'Pending' },
  Active:    { bg: '#E1F5EE', color: '#085041', dot: '#1D9E75', label: 'Active' },
  Confirmed: { bg: '#E6F1FB', color: '#0C447C', dot: '#378ADD', label: 'Confirmed' },
  Past:      { bg: '#F1EFE8', color: '#444441', dot: '#888780', label: 'Completed' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Past;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: cfg.bg, color: cfg.color,
      fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em',
      textTransform: 'uppercase', padding: '4px 10px', borderRadius: '100px'
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

function InfoTile({ icon, label, value }) {
  return (
    <div style={{ background: '#FAFAF8', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ color: '#0F6E56', flexShrink: 0, display: 'flex' }}>{React.cloneElement(icon, { size: 15 })}</span>
      <div>
        <div style={{ fontSize: '10px', color: '#bbb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{value || 'N/A'}</div>
      </div>
    </div>
  );
}

export default function BookingItem({ booking, onRequestRent }) {
  const isPending = booking.status === 'Pending';
  const isConfirmed = booking.status === 'Confirmed';

  return (
    <>
      <style>{`
        .action-btn { transition: background 0.18s; }
        .action-btn:hover { background: #085041 !important; }
        .outline-btn { transition: background 0.18s, border-color 0.18s; }
        .outline-btn:hover { background: #F0F9F6 !important; border-color: #0F6E56 !important; }
      `}</style>

      <div style={{
        background: '#fff',
        borderRadius: '20px',
        border: '1px solid #ECEAE3',
        overflow: 'hidden',
        fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif"
      }}>
        <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap' }}>

          {/* Image strip */}
          <div style={{ width: '120px', flexShrink: 0, background: '#F5F4F0', minHeight: '160px', position: 'relative', overflow: 'hidden' }}>
            {booking.image ? (
              <img src={booking.image} alt={booking.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ddd', gap: '6px', position: 'absolute', inset: 0 }}>
                <Package size={24} />
                <span style={{ fontSize: '11px' }}>No Image</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '20px 24px', minWidth: '240px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <StatusBadge status={booking.status} />
                  <span style={{ fontSize: '11px', color: '#ccc', fontFamily: 'monospace' }}>#{booking.id}</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.01em' }}>{booking.title}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F6E56' }}>Rs. {Number(booking.total || 0).toLocaleString()}</div>
                <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px' }}>total</div>
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px', marginBottom: '16px' }}>
              <InfoTile icon={<Calendar />} label="Period" value={booking.dateRange || booking.period} />
              <InfoTile icon={<Clock />} label="Duration" value={`${booking.duration} day${booking.duration !== 1 ? 's' : ''}`} />
              <InfoTile icon={<ShieldCheck />} label="Protection" value={booking.protection} />
              <InfoTile icon={<DollarSign />} label="Deposit" value={`Rs. ${booking.deposit || 0}`} />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {!isConfirmed && onRequestRent ? (
                <button
                  className="action-btn"
                  onClick={() => onRequestRent(booking.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <ArrowRight size={14} /> Request Rent
                </button>
              ) : isConfirmed ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#E1F5EE', color: '#085041', borderRadius: '10px', padding: '10px 16px', fontSize: '13px', fontWeight: 600 }}>
                  <CheckCircle size={14} style={{ color: '#1D9E75' }} /> Confirmed
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
