import React, { useState } from 'react';
import { getClaimStats } from '../lib/demoState.js';

export default function ClaimsPage({ worker, claims }) {
  const [selected, setSelected] = useState(null);
  const { totalPaid, totalClaims, avgClaimTime } = getClaimStats(claims);

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="grid-2" style={{ alignItems: 'center', gap: 18 }}>
          <div>
            <div className="page-kicker">Payout history</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Claims that are easy to review.</h1>
            <p className="page-lead">
              Every payout here was triggered automatically after a verified disruption. Tap any claim to see the
              exact steps that led to payment.
            </p>
          </div>
          <div className="card-sm" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Claim summary
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--text2)', fontSize: 13 }}>
              <div>Total claims: {totalClaims}</div>
              <div>Total paid out: ₹{totalPaid.toLocaleString()}</div>
              <div>Average claim time: {avgClaimTime}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-3">
        {[
          { label: 'Total claims', value: totalClaims, color: 'var(--text)' },
          { label: 'Total paid out', value: `₹${totalPaid.toLocaleString()}`, color: 'var(--green)' },
          { label: 'Avg claim time', value: avgClaimTime, color: 'var(--accent)' },
        ].map(stat => (
          <div key={stat.label} className="card-sm">
            <div
              style={{
                fontSize: 11,
                color: 'var(--text3)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
            >
              {stat.label}
            </div>
            <div className="stat-num" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {claims.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 36 }}>
          <div style={{ fontSize: 30, marginBottom: 10 }}>⚡</div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>No claims yet</div>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>
            When a verified disruption is simulated in the monitor, it will show up here automatically.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {claims.map(claim => (
            <div
              key={claim.id}
              className="card"
              style={{
                cursor: 'pointer',
                borderColor: selected === claim.id ? 'rgba(249,115,22,0.28)' : 'var(--border)',
                transition: 'all 0.2s',
              }}
              onClick={() => setSelected(selected === claim.id ? null : claim.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 28, lineHeight: 1 }}>{claim.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{claim.type}</span>
                    <span className="badge badge-green">Paid</span>
                    {claim.autoTriggered && <span className="badge badge-blue">Auto-triggered</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                    {claim.id} · {new Date(claim.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {claim.zone}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--green)' }}>
                    ₹{claim.amount}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>via UPI</div>
                </div>
              </div>

              {selected === claim.id && (
                <div className="animate-up" style={{ marginTop: 16, padding: 16, background: 'var(--bg3)', borderRadius: 10, fontSize: 13 }}>
                  <div
                    style={{
                      fontWeight: 500,
                      marginBottom: 12,
                      color: 'var(--text2)',
                      fontSize: 12,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Claim Pipeline
                  </div>
                  {[
                    { step: 'Disruption detected', detail: 'Parametric threshold breached automatically', time: '00:00' },
                    { step: 'Location verified', detail: `GPS confirmed in ${claim.zone}`, time: '00:08' },
                    { step: 'Fraud check passed', detail: 'No duplicate claim and platform activity verified', time: '00:42' },
                    { step: 'Claim approved', detail: 'Auto-approved with no manual review needed', time: '01:10' },
                    {
                      step: `UPI payout ₹${claim.amount}`,
                      detail: `Sent to ${claim.recipientUpi || worker.upi || 'ravikumar@upi'}`,
                      time: '02:18',
                      highlight: true,
                    },
                  ].map((step, index) => (
                    <div key={step.step} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: 'var(--green)',
                            border: '2px solid var(--green)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 9,
                            color: '#fff',
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </div>
                        {index < 4 && <div style={{ width: 1, height: 18, background: 'var(--border2)', marginTop: 2 }} />}
                      </div>
                      <div style={{ paddingBottom: 8 }}>
                        <div style={{ fontWeight: step.highlight ? 600 : 400, color: step.highlight ? 'var(--accent)' : 'var(--text)' }}>
                          {step.step}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 1 }}>{step.detail}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)', flexShrink: 0 }}>{step.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="card-sm" style={{ background: 'var(--bg3)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 20 }}>🛡️</span>
        <div style={{ fontSize: 13, color: 'var(--text2)' }}>
          Every claim is verified using zone checks, disruption thresholds, and duplicate detection before payout.
        </div>
      </div>
    </div>
  );
}
