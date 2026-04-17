import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DISRUPTIONS, calculatePremium } from '../data/mockData.js';
import { buildRecentActivity, getClaimStats } from '../lib/demoState.js';
import { getCoverageWindow } from '../lib/appConfig.js';

const WEEKLY_EARNINGS_BASE = [4200, 5100, 3800, 4900, 4600, 5200];

const TONE_STYLES = {
  critical: { borderColor: 'rgba(239,68,68,0.28)', background: 'rgba(239,68,68,0.08)', color: 'var(--red)' },
  warning: { borderColor: 'rgba(234,179,8,0.28)', background: 'rgba(234,179,8,0.08)', color: 'var(--yellow)' },
  good: { borderColor: 'rgba(34,197,94,0.28)', background: 'rgba(34,197,94,0.08)', color: 'var(--green)' },
  info: { borderColor: 'rgba(96,165,250,0.28)', background: 'rgba(96,165,250,0.08)', color: 'var(--blue)' },
  neutral: { borderColor: 'var(--border)', background: 'var(--bg3)', color: 'var(--text2)' },
};

function getWeekStart(date) {
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);

  const day = current.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  current.setDate(current.getDate() + diffToMonday);
  return current;
}

function buildWeeklyEarningsSeries(claims) {
  const currentWeekStart = getWeekStart(new Date());

  return Array.from({ length: 6 }, (_, index) => {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() - (5 - index) * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const protectedAmount = claims.reduce((sum, claim) => {
      const claimDate = new Date(claim.date);
      return claimDate >= weekStart && claimDate <= weekEnd ? sum + claim.amount : sum;
    }, 0);

    return {
      week: weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      earned: WEEKLY_EARNINGS_BASE[index],
      protected: protectedAmount,
    };
  });
}

export default function WorkerDashboard({
  worker,
  claims,
  alerts,
  insights,
  apiConnected,
  lastSyncedAt,
}) {
  const { premium, maxPayout } = calculatePremium(worker);
  const { totalPaid, totalClaims } = getClaimStats(claims);
  const totalPremiumPaid = premium * 6;
  const protectionRatio = totalPremiumPaid > 0 ? Math.round((totalPaid / totalPremiumPaid) * 100) : 0;
  const earningsData = buildWeeklyEarningsSeries(claims);
  const recentActivities = buildRecentActivity({ claims, premium, alerts });
  const today = new Date();
  const { weekEnd } = getCoverageWindow(today);
  const renewalDate = new Date(weekEnd);
  renewalDate.setDate(weekEnd.getDate() + 1);
  const statusSummary = [
    { label: 'Policy status', value: 'Active' },
    { label: 'Best next move', value: insights[0]?.title || 'Watch live conditions' },
    { label: 'Support mode', value: apiConnected ? 'Backend connected' : 'Local fallback' },
  ];

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="page-kicker">
              {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
              Hello, {worker.name?.split(' ')[0] || 'Ravi'}.
            </h1>
            <p className="page-lead">
              Your coverage is active. This page shows the money protected, the latest alerts, and the one action that
              matters most right now.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              {statusSummary.map(item => (
                <span key={item.label} className="badge badge-blue" style={{ textTransform: 'none', letterSpacing: 0, padding: '6px 12px' }}>
                  {item.label}: {item.value}
                </span>
              ))}
            </div>
          </div>
          <div className="card-sm" style={{ minWidth: 250, background: 'rgba(255, 255, 255, 0.03)' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Current week coverage</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, color: 'var(--green)', lineHeight: 1 }}>
              Rs.{maxPayout.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>
              Renews {renewalDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
            <div style={{ fontSize: 11, color: apiConnected ? 'var(--green)' : 'var(--yellow)', marginTop: 10 }}>
              {apiConnected ? 'Backend connected' : 'Local fallback mode'}
              {lastSyncedAt ? ` - ${new Date(lastSyncedAt).toLocaleTimeString('en-IN')}` : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-4">
        {[
          {
            label: 'Income protected',
            value: `Rs.${totalPaid.toLocaleString()}`,
            sub: totalClaims > 0 ? 'lifetime claims paid' : 'no payouts triggered yet',
            color: 'var(--green)',
            meta: 'Payouts',
          },
          {
            label: 'Premium invested',
            value: `Rs.${totalPremiumPaid.toLocaleString()}`,
            sub: `6 weeks x Rs.${premium}`,
            color: 'var(--accent)',
            meta: 'Premium',
          },
          {
            label: 'Claims filed',
            value: totalClaims,
            sub: totalClaims > 0 ? 'auto-processed by backend' : 'waiting for first trigger',
            color: 'var(--blue)',
            meta: 'Claims',
          },
          {
            label: 'Protection ratio',
            value: `${protectionRatio}%`,
            sub: 'return on premium',
            color: 'var(--purple)',
            meta: 'ROI',
          },
        ].map(stat => (
          <div key={stat.label} className="card-sm">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

      <div className="split-panel">
        <div className="card simplify-hide">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Today’s next steps</h3>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>
            Plain-language guidance based on live conditions, recent payouts, and current backend signals.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {insights.length === 0 ? (
              <div className="card-sm" style={{ background: 'var(--bg3)' }}>
                No live recommendations yet. Simulate a disruption to see how the policy reacts.
              </div>
            ) : (
              insights.map(insight => {
                const tone = TONE_STYLES[insight.tone] || TONE_STYLES.neutral;
                return (
                  <div
                    key={insight.id}
                    className="card-sm"
                    style={{ background: tone.background, borderColor: tone.borderColor }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: tone.color, marginBottom: 4 }}>{insight.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)' }}>{insight.detail}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="card simplify-hide">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Zone Alerts</h3>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>
            Clear notices affecting the policy right now.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.length === 0 ? (
              <div className="card-sm" style={{ background: 'var(--bg3)' }}>No active alerts.</div>
            ) : (
              alerts.slice(0, 4).map(alert => {
                const tone = TONE_STYLES[alert.severity] || TONE_STYLES.info;
                return (
                  <div key={alert.id} className="card-sm" style={{ background: tone.background, borderColor: tone.borderColor }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                      <div style={{ fontWeight: 600, color: tone.color }}>{alert.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                        {new Date(alert.createdAt).toLocaleTimeString('en-IN')}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text2)' }}>{alert.message}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Weekly Earnings + Protection</h3>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>
          Projected weekly income versus the payouts now recorded by the backend
        </p>
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
            <XAxis dataKey="week" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={value => `Rs.${value}`} />
            <Tooltip
              contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              formatter={(value, name) => [`Rs.${value}`, name === 'earned' ? 'Projected earnings' : 'Protected amount']}
            />
            <Area type="monotone" dataKey="earned" stroke="#f97316" strokeWidth={2} fill="url(#gEarned)" />
            <Area type="monotone" dataKey="protected" stroke="#22c55e" strokeWidth={2} fill="url(#gProtected)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>This Week&apos;s Coverage</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DISRUPTIONS.map(disruption => (
            <div key={disruption.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{disruption.icon}</span>
              <span style={{ fontSize: 13, flex: 1 }}>{disruption.name}</span>
              <div className="progress-track" style={{ flex: 2 }}>
                <div className="progress-fill" style={{ width: '100%', background: disruption.color }} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--accent)', minWidth: 84, textAlign: 'right' }}>
                Rs.{disruption.payout}/day
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {recentActivities.map((activity, index) => {
            const tone = TONE_STYLES[activity.tone] || TONE_STYLES.neutral;
            return (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: index < recentActivities.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: tone.color, marginTop: 8, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{activity.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{activity.detail}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)', flexShrink: 0 }}>{activity.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
