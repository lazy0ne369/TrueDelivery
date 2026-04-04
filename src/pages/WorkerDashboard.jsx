import React from 'react';
import { MOCK_CLAIMS, DISRUPTIONS, calculatePremium } from '../data/mockData.js';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getCoverageWindow } from '../lib/appConfig.js';

const earningsData = [
  { week: 'W1', earned: 4200, protected: 500 },
  { week: 'W2', earned: 5100, protected: 0 },
  { week: 'W3', earned: 3800, protected: 500 },
  { week: 'W4', earned: 4900, protected: 400 },
  { week: 'W5', earned: 4600, protected: 0 },
  { week: 'W6', earned: 5200, protected: 300 },
];

const maxDisruptionPayout = Math.max(...DISRUPTIONS.map(d => d.payout));

export default function WorkerDashboard({ worker }) {
  const { premium, maxPayout } = calculatePremium(worker);
  const totalProtected = MOCK_CLAIMS.reduce((s, c) => s + c.amount, 0);
  const totalPremiumPaid = premium * 6;
  const protectionRatio = totalPremiumPaid > 0 ? Math.round(totalProtected / totalPremiumPaid * 100) : 0;
  const today = new Date();
  const { weekEnd } = getCoverageWindow(today);
  const renewalDate = new Date(weekEnd);
  renewalDate.setDate(weekEnd.getDate() + 1);

  // Dynamic relative dates based on current week
  const thisMonday = new Date(today);
  const dayOfWeek = thisMonday.getDay();
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  thisMonday.setDate(today.getDate() + diffToMon);
  const fmtShort = d => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Greeting */}
      <div style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, var(--bg2) 0%, rgba(249,115,22,0.08) 100%)',
        borderRadius: 'var(--radius)',
        border: '1px solid #f9731630',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 4 }}>{today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
            Namaste, {worker.name?.split(' ')[0] || 'Ravi'} 👋
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Your income is protected this week. Keep delivering!</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Current week coverage</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--green)' }}>₹{maxPayout.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>renews {renewalDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid-4">
        {[
          { label: 'Income protected', value: `₹${totalProtected.toLocaleString()}`, sub: 'lifetime claims paid', color: 'var(--green)', icon: '💰' },
          { label: 'Premium invested', value: `₹${totalPremiumPaid.toLocaleString()}`, sub: '6 weeks × ₹'+premium, color: 'var(--accent)', icon: '📊' },
          { label: 'Claims filed', value: MOCK_CLAIMS.length, sub: '100% auto-processed', color: 'var(--blue)', icon: '⚡' },
          { label: 'Protection ratio', value: `${protectionRatio}%`, sub: 'return on premium', color: 'var(--purple)', icon: '🛡️' },
        ].map(s => (
          <div key={s.label} className="card-sm">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label-sm">{s.label}</div>
                <div className="stat-num" style={{ color: s.color, fontSize: 24 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{s.sub}</div>
              </div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Earnings chart */}
      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Weekly Earnings + Protection</h3>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>Your actual income vs. claims paid out each week</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={earningsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gEarned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gProtected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" tick={{ fill: '#5a5855', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#5a5855', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
            <Tooltip contentStyle={{ background: '#181b22', border: '1px solid #ffffff12', borderRadius: 8, fontSize: 12 }} formatter={(v, n) => [`₹${v}`, n === 'earned' ? 'Earnings' : 'Protected']} />
            <Area type="monotone" dataKey="earned" stroke="#f97316" strokeWidth={2} fill="url(#gEarned)" />
            <Area type="monotone" dataKey="protected" stroke="#22c55e" strokeWidth={2} fill="url(#gProtected)" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)' }}>
            <div style={{ width: 12, height: 3, background: 'var(--accent)', borderRadius: 2 }} /> Weekly earnings
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)' }}>
            <div style={{ width: 12, height: 3, background: 'var(--green)', borderRadius: 2 }} /> Claims paid
          </div>
        </div>
      </div>

      {/* Active week coverage */}
      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>This Week's Coverage</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DISRUPTIONS.map(d => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{d.icon}</span>
              <span style={{ fontSize: 13, flex: 1 }}>{d.name}</span>
              <div className="progress-track" style={{ flex: 2 }}>
                <div className="progress-fill" style={{ width: `${Math.round(d.payout / maxDisruptionPayout * 100)}%`, background: d.color }} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--accent)', minWidth: 60, textAlign: 'right' }}>₹{d.payout}/day</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { icon: '✓', text: 'Weekly premium ₹'+premium+' deducted', time: fmtShort(thisMonday), color: 'var(--text3)' },
            { icon: '💰', text: 'Claim paid — Heavy rain · ₹500 to UPI', time: fmtShort(new Date(thisMonday.getTime() + 2 * 86400000)), color: 'var(--green)' },
            { icon: '🔄', text: 'Policy renewed for current week', time: fmtShort(thisMonday), color: 'var(--blue)' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: a.color }}>{a.text}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', flexShrink: 0 }}>{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
