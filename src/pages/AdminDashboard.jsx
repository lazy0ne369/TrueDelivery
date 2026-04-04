import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ADMIN_STATS } from '../data/mockData.js';
import { APP_NAME } from '../lib/appConfig.js';

const COLORS = ['var(--blue)', 'var(--accent)', 'var(--red)', 'var(--purple)', 'var(--yellow)'];

export default function AdminDashboard({ summary, alerts, apiConnected, lastSyncedAt }) {
  const effectiveSummary = summary || {
    ...ADMIN_STATS,
    recentAlerts: alerts || [],
    systemHealth: [],
  };

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="page-kicker">Operations overview</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 28, fontWeight: 800 }}>Admin console</h1>
              <span className="badge badge-accent">{APP_NAME} Ops</span>
            </div>
            <p className="page-lead">
              View portfolio health, claims trends, and the latest backend sync state in one place.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span className={apiConnected ? 'badge badge-green' : 'badge badge-yellow'}>
              {apiConnected ? 'API online' : 'API offline'}
            </span>
            <span className="badge badge-blue">{effectiveSummary.activePolicies.toLocaleString()} active policies</span>
            <span className="badge badge-purple">
              {lastSyncedAt ? `Synced ${new Date(lastSyncedAt).toLocaleTimeString('en-IN')}` : 'Waiting for sync'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid-4">
        {[
          { label: 'Active policies', value: effectiveSummary.activePolicies.toLocaleString(), sub: `+${effectiveSummary.weeklyNewSignups} this week`, color: 'var(--text)', meta: 'Policy' },
          { label: 'Premium collected', value: `Rs.${(effectiveSummary.totalPremiumCollected / 1000).toFixed(1)}K`, sub: 'aggregated premium pool', color: 'var(--accent)', meta: 'Premium' },
          { label: 'Total payouts', value: `Rs.${(effectiveSummary.totalPayouts / 1000).toFixed(1)}K`, sub: `loss ratio ${effectiveSummary.lossRatio}%`, color: 'var(--green)', meta: 'Payout' },
          { label: 'Fraud prevented', value: effectiveSummary.fraudPrevented, sub: `avg claim ${effectiveSummary.avgClaimTime}`, color: 'var(--red)', meta: 'Risk' },
        ].map(stat => (
          <div key={stat.label} className="card-sm">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                  {stat.label}
                </div>
                <div className="stat-num" style={{ color: stat.color, fontSize: 24 }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{stat.sub}</div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {stat.meta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-panel">
        <div className="card simplify-hide">
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Premium vs Payouts - Weekly</h3>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>
            Loss ratio trend using the backend snapshot plus baseline portfolio data
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={effectiveSummary.weeklyData} barSize={20} barGap={6}>
              <XAxis dataKey="week" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={value => `Rs.${value / 1000}K`} />
              <Tooltip
                contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                formatter={(value, name) => [`Rs.${value.toLocaleString()}`, name === 'premium' ? 'Premium collected' : 'Payouts']}
              />
              <Bar dataKey="premium" fill="#f97316" radius={[4, 4, 0, 0]} opacity={0.85} />
              <Bar dataKey="payouts" fill="#22c55e" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card simplify-hide">
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Claims by Disruption Type</h3>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10 }}>
            Distribution updates as the backend records new worker claims
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={effectiveSummary.claimsByType} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={35} paddingAngle={3}>
                {effectiveSummary.claimsByType.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} formatter={value => [`${value}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {effectiveSummary.claimsByType.map((type, index) => (
              <div key={type.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[index], flexShrink: 0 }} />
                <span style={{ color: 'var(--text2)', flex: 1 }}>{type.name}</span>
                <span style={{ fontWeight: 600 }}>{type.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="split-panel">
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>System Health</h3>
          <div className="grid-2">
            {(effectiveSummary.systemHealth || []).map(item => (
              <div
                key={item.id}
                className="card-sm"
                style={{
                  background: item.tone === 'good' ? 'rgba(34,197,94,0.08)' : item.tone === 'warning' ? 'rgba(234,179,8,0.08)' : 'var(--bg3)',
                  borderColor: item.tone === 'good' ? 'rgba(34,197,94,0.28)' : item.tone === 'warning' ? 'rgba(234,179,8,0.28)' : 'var(--border)',
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: item.tone === 'good' ? 'var(--green)' : item.tone === 'warning' ? 'var(--yellow)' : 'var(--text)' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Recent Alert Feed</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(effectiveSummary.recentAlerts || alerts || []).slice(0, 4).map(alert => (
              <div key={alert.id} className="card-sm" style={{ background: 'var(--bg3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                  <div style={{ fontWeight: 600, color: alert.severity === 'critical' ? 'var(--red)' : alert.severity === 'warning' ? 'var(--yellow)' : alert.severity === 'good' ? 'var(--green)' : 'var(--blue)' }}>
                    {alert.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                    {new Date(alert.createdAt).toLocaleTimeString('en-IN')}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{alert.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Zone Risk Heatmap</h3>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
              Risk score combines flood history, claim frequency, and disruption intensity.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {effectiveSummary.riskZones.map(zone => (
            <div key={zone.zone} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ minWidth: 130, fontSize: 13, color: 'var(--text)' }}>{zone.zone}</div>
              <div style={{ flex: 1 }}>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${zone.riskScore}%`, background: zone.riskScore > 75 ? 'var(--red)' : zone.riskScore > 50 ? 'var(--yellow)' : 'var(--green)' }} />
                </div>
              </div>
              <div style={{ minWidth: 36, fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700, color: zone.riskScore > 75 ? 'var(--red)' : zone.riskScore > 50 ? 'var(--yellow)' : 'var(--green)', textAlign: 'right' }}>
                {zone.riskScore}
              </div>
              <div style={{ minWidth: 100, fontSize: 12, color: 'var(--text2)', textAlign: 'right' }}>{zone.activePolicies} policies</div>
              <div style={{ minWidth: 70, fontSize: 12, color: 'var(--text3)', textAlign: 'right' }}>{zone.claims} claims</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Weekly Claims Volume Trend</h3>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>
          Baseline portfolio trend plus current demo backend activity
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={effectiveSummary.weeklyData}>
            <XAxis dataKey="week" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} formatter={value => [value, 'Claims']} />
            <Line type="monotone" dataKey="claims" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
