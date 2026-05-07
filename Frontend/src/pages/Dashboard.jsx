import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, Package, BarChart3, DollarSign,
  Calendar, Bell, ArrowUpRight, TrendingUp, PlusCircle,
  ChevronRight, Users, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

/* ─── Shared helpers ─── */
const STATUS_CFG = {
  Pending:   { bg: '#FAEEDA', color: '#633806', dot: '#EF9F27' },
  Active:    { bg: '#E1F5EE', color: '#085041', dot: '#1D9E75' },
  Confirmed: { bg: '#E6F1FB', color: '#0C447C', dot: '#378ADD' },
  Approved:  { bg: '#EAF3DE', color: '#27500A', dot: '#639922' },
  Past:      { bg: '#F1EFE8', color: '#5F5E5A', dot: '#888780' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.Past;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      background: cfg.bg, color: cfg.color,
      fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
      textTransform: 'uppercase', padding: '3px 9px', borderRadius: '100px',
      whiteSpace: 'nowrap'
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {status || 'N/A'}
    </span>
  );
}

/* ─── Main Dashboard ─── */
export default function Dashboard({ setActiveTab }) {
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const navItems = [
    { key: 'overview',   icon: <LayoutDashboard size={16} />, label: 'Overview' },
    { key: 'orders',     icon: <Package size={16} />,         label: 'My Orders' },
    { key: 'analytics',  icon: <BarChart3 size={16} />,       label: 'Earnings' },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        .dash-nav-btn { transition: background 0.16s, color 0.16s; font-family: 'DM Sans', sans-serif; border: none; cursor: pointer; text-align: left; width: 100%; }
        .dash-nav-btn.active { background: #E1F5EE; color: #085041; }
        .dash-nav-btn.inactive { background: transparent; color: #888; }
        .dash-nav-btn.inactive:hover { background: #F5F4F0; color: #333; }
        .stat-card { transition: box-shadow 0.2s; }
        .stat-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
        .order-card { transition: box-shadow 0.2s; }
        .order-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); }
        .reminder-btn { transition: background 0.16s; }
        .reminder-btn:hover { background: #854F0B !important; }
        .add-btn { transition: background 0.16s; }
        .add-btn:hover { background: #085041 !important; }
      `}</style>

      <div style={{ display: 'flex', height: 'calc(100vh - 64px)', fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif", background: '#FAFAF8' }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: '220px', background: '#fff', borderRight: '1px solid #ECEAE3', padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 12px', marginBottom: '12px' }}>
            Admin Panel
          </p>

          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveSubTab(item.key)}
              className={`dash-nav-btn ${activeSubTab === item.key ? 'active' : 'inactive'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}
            >
              {item.icon}
              {item.label}
              {activeSubTab === item.key && (
                <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              )}
            </button>
          ))}

          {/* Divider */}
          <div style={{ borderTop: '1px solid #ECEAE3', margin: '16px 0' }} />

          <button
            onClick={() => setActiveTab && setActiveTab('addProduct')}
            className="add-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: '#0F6E56', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <PlusCircle size={16} /> Add Product
          </button>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '36px 40px' }}>
          {activeSubTab === 'overview'  && <OverviewSection  setActiveTab={setActiveTab} />}
          {activeSubTab === 'orders'    && <OrdersSection />}
          {activeSubTab === 'analytics' && <AnalyticsSection />}
        </main>
      </div>
    </>
  );
}

/* ─── Overview ─── */
function OverviewSection({ setActiveTab }) {
  const [overview, setOverview] = useState({ monthlyRevenue: 0, activeRentals: 0, pendingApproval: 0, totalItems: 0 });
  const [transactions, setTransactions] = useState([]);
  const API_BASE_URL = "http://localhost:8086";

  useEffect(() => {
    const load = async () => {
      try {
        const [ov, tx] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/dashboard/overview`),
          axios.get(`${API_BASE_URL}/api/dashboard/transactions`)
        ]);
        if (ov.data.success) setOverview(ov.data.data);
        if (tx.data.success) setTransactions(tx.data.data.slice(0, 6));
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

  const stats = [
    {
      label: 'Monthly Revenue', icon: <DollarSign size={18} />,
      value: `Rs. ${Number(overview.monthlyRevenue || 0).toLocaleString()}`,
      sub: '+12.5% vs last month', color: { bg: '#E1F5EE', ic: '#0F6E56', sub: '#1D9E75' }
    },
    {
      label: 'Active Rentals', icon: <Activity size={18} />,
      value: overview.activeRentals || 0,
      sub: `${overview.totalItems || 0} total items`, color: { bg: '#E6F1FB', ic: '#185FA5', sub: '#378ADD' }
    },
    {
      label: 'Pending Approval', icon: <Calendar size={18} />,
      value: overview.pendingApproval || 0,
      sub: 'Requires attention', color: { bg: '#FAEEDA', ic: '#BA7517', sub: '#EF9F27' }
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Dashboard</p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '30px', fontWeight: 700, color: '#0D0D0D', margin: 0, letterSpacing: '-0.02em' }}>
            Welcome back, Admin
          </h1>
          <p style={{ fontSize: '14px', color: '#999', margin: '6px 0 0' }}>Here's what's happening with your rentals today.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ background: '#fff', borderRadius: '18px', border: '1px solid #ECEAE3', padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: s.color.bg, borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color.ic }}>
                {s.icon}
              </div>
              <TrendingUp size={14} style={{ color: '#ddd' }} />
            </div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{s.label}</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#111', margin: '0 0 4px', letterSpacing: '-0.02em' }}>{s.value}</p>
            <p style={{ fontSize: '12px', color: s.color.sub, margin: 0, fontWeight: 500 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #ECEAE3', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0EEE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111', margin: 0 }}>Recent Transactions</h2>
            <p style={{ fontSize: '12px', color: '#bbb', margin: '3px 0 0' }}>Latest 6 booking activities</p>
          </div>
          <ArrowUpRight size={18} style={{ color: '#ddd' }} />
        </div>

        {transactions.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#ccc', fontSize: '14px' }}>No transactions yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#FAFAF8' }}>
                  {['Booking ID', 'Customer', 'Item', 'Status', 'Amount'].map((h, i) => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: i === 4 ? 'right' : 'left', fontSize: '11px', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((b, i) => (
                  <tr key={b.id} style={{ borderTop: '1px solid #F5F4F0' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#555', fontFamily: 'monospace', fontSize: '12px' }}>#{b.id}</td>
                    <td style={{ padding: '14px 20px', color: '#555' }}>{b.customerName || 'N/A'}</td>
                    <td style={{ padding: '14px 20px', color: '#777', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title || 'N/A'}</td>
                    <td style={{ padding: '14px 20px' }}><StatusBadge status={b.status} /></td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, color: '#0F6E56', whiteSpace: 'nowrap' }}>Rs. {Number(b.total || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Orders ─── */
function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const API_BASE_URL = "http://localhost:8086";

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/bookings/approved`)
      .then(r => { if (r.data.success) setOrders(r.data.data); })
      .catch(console.error);
  }, []);

  const handleReminder = async (bookingId) => {
    try {
      const r = await axios.put(`${API_BASE_URL}/api/bookings/${bookingId}/reminder`);
      alert(r.data.success ? "Return reminder sent to customer." : r.data.message);
    } catch { alert("Failed to send reminder"); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Admin</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', fontWeight: 700, color: '#0D0D0D', margin: '0 0 4px', letterSpacing: '-0.02em' }}>My Orders</h2>
        <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>Approved customer orders with full details.</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '20px', border: '1.5px dashed #E0DED8', color: '#ccc', fontSize: '14px' }}>
          <Package size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p style={{ margin: 0 }}>No approved orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {orders.map(order => (
            <div key={order.id} className="order-card" style={{ background: '#fff', borderRadius: '18px', border: '1px solid #ECEAE3', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap' }}>
                {/* Image */}
                <div style={{ width: '120px', flexShrink: 0, background: '#F5F4F0', minHeight: '140px', position: 'relative', overflow: 'hidden' }}>
                  {order.image
                    ? <img src={order.image} alt={order.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                    : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', flexDirection: 'column', gap: '6px', fontSize: '11px' }}><Package size={22} />No Image</div>
                  }
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111', margin: '0 0 6px' }}>{order.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <StatusBadge status={order.status} />
                        <span style={{ fontSize: '11px', color: '#ccc', fontFamily: 'monospace' }}>#{order.id}</span>
                      </div>
                    </div>
                    <button
                      className="reminder-btn"
                      onClick={() => handleReminder(order.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#BA7517', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      <Bell size={13} /> Send Reminder
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    {/* Product Details */}
                    <div style={{ background: '#FAFAF8', borderRadius: '12px', padding: '14px 16px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>Product Details</p>
                      {[
                        ['Period', order.dateRange || order.period],
                        ['Duration', `${order.duration || 0} days`],
                        ['Deposit', `Rs. ${Number(order.deposit || 0).toLocaleString()}`],
                        ['Total', `Rs. ${Number(order.total || 0).toLocaleString()}`],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '3px 0' }}>
                          <span style={{ color: '#aaa' }}>{k}</span>
                          <span style={{ color: '#333', fontWeight: 600 }}>{v || 'N/A'}</span>
                        </div>
                      ))}
                    </div>

                    {/* Customer Details */}
                    <div style={{ background: '#FAFAF8', borderRadius: '12px', padding: '14px 16px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>Customer Details</p>
                      {[
                        ['Name', order.customerName],
                        ['Email', order.customerEmail],
                        ['Phone', order.customerPhone],
                        ['User ID', order.userId],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '3px 0', gap: '8px' }}>
                          <span style={{ color: '#aaa', flexShrink: 0 }}>{k}</span>
                          <span style={{ color: '#333', fontWeight: 600, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v || 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Analytics ─── */
function AnalyticsSection() {
  const [chartData, setChartData] = useState([]);
  const [netRevenue, setNetRevenue] = useState(0);
  const [selectedDays, setSelectedDays] = useState(7);
  const API_BASE_URL = "http://localhost:8086";

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/dashboard/earnings?days=${selectedDays}`)
      .then(r => {
        if (r.data.success) {
          setChartData(r.data.data.chartData || []);
          setNetRevenue(r.data.data.netRevenue || 0);
        }
      }).catch(console.error);
  }, [selectedDays]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <p style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Analytics</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', fontWeight: 700, color: '#0D0D0D', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Earnings</h2>
        <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>Revenue breakdown over selected period.</p>
      </div>

      {/* Revenue Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0A3D2B 0%, #0F6E56 100%)', borderRadius: '18px', padding: '28px 28px', color: '#fff' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', margin: '0 0 8px' }}>Net Revenue</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '34px', fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Rs. {Number(netRevenue || 0).toLocaleString()}
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            {selectedDays === 7 ? 'Last 7 days' : 'Last 30 days'}
          </p>
        </div>
        <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #ECEAE3', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#bbb', margin: '0 0 8px' }}>Transactions</p>
          <p style={{ fontSize: '34px', fontWeight: 700, color: '#111', margin: 0, fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}>{chartData.length}</p>
          <p style={{ fontSize: '13px', color: '#bbb', margin: 0 }}>data points shown</p>
        </div>
      </div>

      {/* Chart Card */}
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #ECEAE3', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0EEE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: 0 }}>Revenue Chart</h3>
          <select
            value={selectedDays}
            onChange={e => setSelectedDays(Number(e.target.value))}
            style={{ background: '#F5F4F0', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, color: '#555', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
        </div>

        <div style={{ padding: '24px' }}>
          {chartData.length === 0 ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '14px' }}>
              No earnings data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EEE8" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#bbb', fontFamily: 'DM Sans' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#bbb', fontFamily: 'DM Sans' }} dx={-4} />
                <Tooltip
                  cursor={{ fill: '#FAFAF8', radius: 8 }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #ECEAE3', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: '13px', fontFamily: 'DM Sans' }}
                  labelStyle={{ fontWeight: 700, color: '#111' }}
                />
                <Bar dataKey="income" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i === chartData.length - 1 ? '#0F6E56' : '#9FE1CB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}