import React from 'react';
import { DISRUPTIONS, ZONES, calculatePremium } from '../data/mockData.js';
import { getCoverageWindow, getPolicyId } from '../lib/appConfig.js';

function getSeasonLabel(season) {
  return season.charAt(0).toUpperCase() + season.slice(1);
}

function getCoverageLabel(coverage) {
  if (coverage === 'basic') return 'Basic Shield';
  if (coverage === 'premium') return 'Full Shield';
  return 'Standard Shield';
}

function getClaimHistoryNote(claims) {
  if (claims === 0) {
    return {
      label: 'No prior claims',
      note: 'Clean record discount applied',
    };
  }

  if (claims <= 2) {
    return {
      label: `${claims} recent claim${claims > 1 ? 's' : ''}`,
      note: 'Standard history pricing',
    };
  }

  return {
    label: `${claims} recent claims`,
    note: 'Higher repeat-claim loading',
  };
}

export default function PolicyPage({ worker, alerts, apiConnected }) {
  const zone = ZONES.find(item => item.id === worker.zone) || ZONES[0];
  const { premium, maxPayout, zoneFactor, seasonFactor, historyFactor, coverageFactor } = calculatePremium(worker);
  const { weekStart, weekEnd } = getCoverageWindow();
  const policyId = getPolicyId(worker);
  const claimHistory = getClaimHistoryNote(worker.claims);
  const plainLanguagePoints = [
    'Coverage starts automatically each week.',
    `Your payout limit is Rs.${maxPayout.toLocaleString()} when a trigger is met.`,
    'Claims are paid to your UPI account without paperwork.',
  ];

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="grid-2" style={{ alignItems: 'center', gap: 18 }}>
          <div>
            <div className="page-kicker">Policy summary</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Your policy, explained in plain language.</h1>
            <p className="page-lead">
              This page shows what is covered, what it costs, and how payouts happen. The details stay visible, but
              the summary comes first.
            </p>
          </div>
          <div className="card-sm simplify-hide" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              What this means
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plainLanguagePoints.map(point => (
                <div key={point} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text2)', fontSize: 13, lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--green)', marginTop: 2 }}>•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          borderColor: 'rgba(249,115,22,0.28)',
          background: 'linear-gradient(135deg, var(--bg2) 0%, rgba(249,115,22,0.06) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'var(--accent)', opacity: 0.04 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="badge badge-green">Active</span>
              <span className="badge badge-accent">{getCoverageLabel(worker.coverage)}</span>
              <span className={apiConnected ? 'badge badge-blue' : 'badge badge-yellow'}>
                {apiConnected ? 'API linked' : 'Local only'}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              Policy #{policyId}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>
              {weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {weekEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>Weekly premium</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
              Rs.{premium}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Auto-deducted every Monday</div>
          </div>
        </div>

        <div className="divider" />

        <div className="grid-3">
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Max weekly payout</div>
            <div className="stat-num" style={{ color: 'var(--green)' }}>Rs.{maxPayout.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Work zone</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{zone.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>Risk profile: {zone.risk}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Payout channel</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>UPI instant payout</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{worker.upi || 'ravikumar@upi'}</div>
          </div>
        </div>
      </div>

      <div className="split-panel">
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>What you&apos;re covered for</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {DISRUPTIONS.map(disruption => (
              <div key={disruption.id} className="card-sm" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{disruption.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>{disruption.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>{disruption.description}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{disruption.condition}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', fontSize: 14 }}>Rs.{disruption.payout}/day</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Policy notices</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.length === 0 ? (
              <div className="card-sm" style={{ background: 'var(--bg3)' }}>
                No policy notices yet. Alerts from the backend will appear here automatically.
              </div>
            ) : (
              alerts.slice(0, 4).map(alert => (
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
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card simplify-hide">
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>How your premium is calculated</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Base weekly rate', value: 'Rs.59.00', neutral: true },
            { label: `Zone factor - ${zone.name}`, value: `x ${zoneFactor.toFixed(2)}`, note: zone.risk === 'high' ? 'High disruption exposure zone' : zone.risk === 'medium' ? 'Moderate disruption exposure zone' : 'Lower disruption exposure zone' },
            { label: `Season factor - ${getSeasonLabel(worker.season)}`, value: `x ${seasonFactor.toFixed(2)}`, note: worker.season === 'monsoon' ? 'Peak disruption season' : worker.season === 'summer' ? 'Higher heat exposure' : 'Lower seasonal loading' },
            { label: `Claim history - ${claimHistory.label}`, value: `x ${historyFactor.toFixed(2)}`, note: claimHistory.note },
            { label: `Coverage tier - ${getCoverageLabel(worker.coverage)}`, value: `x ${coverageFactor.toFixed(2)}`, note: 'Your selected weekly coverage limit' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', gap: 16 }}>
              <div>
                <div style={{ fontSize: 13 }}>{row.label}</div>
                {row.note && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{row.note}</div>}
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: row.neutral ? 'var(--text)' : 'var(--text2)', fontSize: 14 }}>
                {row.value}
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <span style={{ fontWeight: 600 }}>Final weekly premium</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)', fontSize: 20 }}>Rs.{premium}</span>
          </div>
        </div>
      </div>

      <div className="card simplify-hide" style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'var(--redbg)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--red)', marginBottom: 10 }}>Not covered</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Health and medical bills', 'Life insurance', 'Vehicle repairs', 'Accident damages', 'Personal injury'].map(item => (
            <span key={item} style={{ fontSize: 12, color: 'var(--text2)', padding: '4px 10px', background: 'var(--bg2)', borderRadius: 6, border: '1px solid var(--border)' }}>
              x {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
