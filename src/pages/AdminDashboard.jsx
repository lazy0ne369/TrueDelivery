import React from 'react';
import { ADMIN_STATS } from '../data/mockData.js';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { APP_NAME } from '../lib/appConfig.js';

// Raw hex colors for Recharts (doesn't resolve CSS variables)
const COLORS = ['#60a5fa', '#f97316', '#ef4444', '#a78bfa', '#eab308'];

// Map CSS var names to raw hex for inline dynamic styles
const COLOR_HEX = {
  'var(--red)': '#ef4444',
  'var(--yellow)': '#eab308',
  'var(--blue)': '#60a5fa',
};

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Insurer Admin Panel</h1>
            <span className="badge badge-accent">{APP_NAME} Ops</span>
          </div>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Hyderabad region · Food delivery segment · Week of Dec 23, 2024</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="badge badge-green">● 3,891 active policies</span>
          <span className="badge badge-blue">Live data</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-4">
        {[
          { label: 'Active policies', value: ADMIN_STATS.activePolices.toLocaleString(), sub: `+${ADMIN_STATS.weeklyNewSignups} this week`, color: 'var(--text)', icon: '👥' },
          { label: 'Premium collected', value: `₹${(ADMIN_STATS.totalPremiumCollected/1000).toFixed(1)}K`, sub: 'last 6 weeks', color: 'var(--accent)', icon: '💳' },
          { label: 'Total payouts', value: `₹${(ADMIN_STATS.totalPayouts/1000).toFixed(1)}K`, sub: 'loss ratio '+ADMIN_STATS.lossRatio+'%', color: 'var(--green)', icon: '📤' },
          { label: 'Fraud prevented', value: ADMIN_STATS.fraudPrevented, sub: `avg claim ${ADMIN_STATS.avgClaimTime}`, color: 'var(--red)', icon: '🛡️' },
        ].map(s => (
          <div key={s.label} className="card-sm">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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

      <div className="chart-panel">
        {/* Premium vs Payouts bar chart */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Premium vs Payouts — Weekly</h3>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>Monitor loss ratio trends. Loss ratio target: &lt;80%</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ADMIN_STATS.weeklyData} barSize={20} barGap={6}>
              <XAxis dataKey="week" tick={{ fill: '#5a5855', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5a5855', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
              <Tooltip
                contentStyle={{ background: '#181b22', border: '1px solid #ffffff12', borderRadius: 8, fontSize: 12 }}
                formatter={(v, n) => [`₹${v.toLocaleString()}`, n === 'premium' ? 'Premium collected' : 'Payouts']}
              />
              <Bar dataKey="premium" fill="#f97316" radius={[4,4,0,0]} opacity={0.85} />
              <Bar dataKey="payouts" fill="#22c55e" radius={[4,4,0,0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)' }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#f97316' }} /> Premium</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)' }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#22c55e' }} /> Payouts</div>
          </div>
        </div>

        {/* Claims by type donut */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Claims by Disruption Type</h3>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10 }}>Last 6 weeks breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={ADMIN_STATS.claimsByType} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={35} paddingAngle={3}>
                {ADMIN_STATS.claimsByType.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#181b22', border: '1px solid #ffffff12', borderRadius: 8, fontSize: 12 }} formatter={v => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ADMIN_STATS.claimsByType.map((t, i) => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i], flexShrink: 0 }} />
                <span style={{ color: 'var(--text2)', flex: 1 }}>{t.name}</span>
                <span style={{ fontWeight: 600 }}>{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk heatmap / zone table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Zone Risk Heatmap</h3>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>Risk score = composite of flood history, claim frequency, disruption intensity</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ADMIN_STATS.riskZones.map((z) => (
            <div key={z.zone} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: '0 0 110px', fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{z.zone}</div>
              <div style={{ flex: 1 }}>
                <div className="progress-track">
                  <div className="progress-fill" style={{
                    width: z.riskScore + '%',
                    background: z.riskScore > 75 ? '#ef4444' : z.riskScore > 50 ? '#eab308' : '#22c55e',
                  }} />
                </div>
              </div>
              <div style={{ minWidth: 36, fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700, color: z.riskScore > 75 ? '#ef4444' : z.riskScore > 50 ? '#eab308' : '#22c55e', textAlign: 'right' }}>{z.riskScore}</div>
              <div style={{ minWidth: 90, fontSize: 12, color: 'var(--text2)', textAlign: 'right' }}>{z.activePolicies} policies</div>
              <div style={{ minWidth: 65, fontSize: 12, color: 'var(--text3)', textAlign: 'right' }}>{z.claims} claims</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fraud detection summary */}
      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Fraud Detection Summary</h3>
        <div className="grid-3">
          {[
            { label: 'GPS spoofing attempts', value: 23, status: 'rejected', color: 'var(--red)', hex: '#ef4444' },
            { label: 'Duplicate claim attempts', value: 18, status: 'blocked', color: 'var(--yellow)', hex: '#eab308' },
            { label: 'Suspicious patterns flagged', value: 6, status: 'reviewed', color: 'var(--blue)', hex: '#60a5fa' },
          ].map(f => (
            <div key={f.label} className="card-sm" style={{ background: 'var(--bg3)' }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>{f.label}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="stat-num" style={{ color: f.color, fontSize: 28 }}>{f.value}</span>
                <span className="badge" style={{ color: f.hex, borderColor: f.hex + '50', background: f.hex + '15' }}>{f.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: 12, background: 'var(--bg3)', borderRadius: 8, fontSize: 12, color: 'var(--text2)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <span>✓ GPS location must be inside affected zone boundary</span>
          <span>✓ Max 1 claim per disruption event per worker</span>
          <span>✓ Platform activity cross-referenced for outage claims</span>
          <span>✓ Historical pattern scoring per worker ID</span>
        </div>
      </div>

      {/* Claim trend line */}
      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Weekly Claims Volume Trend</h3>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>Number of claims filed per week across all disruption types</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={ADMIN_STATS.weeklyData}>
            <XAxis dataKey="week" tick={{ fill: '#5a5855', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#5a5855', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#181b22', border: '1px solid #ffffff12', borderRadius: 8, fontSize: 12 }} formatter={v => [v, 'Claims']} />
            <Line type="monotone" dataKey="claims" stroke="#f97316" strokeWidth={2.5} dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
