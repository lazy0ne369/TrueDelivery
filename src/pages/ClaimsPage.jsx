import React, { useState } from 'react';
import { MOCK_CLAIMS } from '../data/mockData.js';

export default function ClaimsPage({ worker }) {
  const [selected, setSelected] = useState(null);
  const totalPaid = MOCK_CLAIMS.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Claims History</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4 }}>All claims auto-triggered · Zero paperwork</p>
      </div>

      {/* Summary */}
      <div className="grid-3">
        {[
          { label: 'Total claims', value: MOCK_CLAIMS.length, color: 'var(--text)' },
          { label: 'Total paid out', value: `₹${totalPaid.toLocaleString()}`, color: 'var(--green)' },
          { label: 'Avg claim time', value: '2.3 min', color: 'var(--accent)' },
        ].map(s => (
          <div key={s.label} className="card-sm">
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{s.label}</div>
            <div className="stat-num" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Claims list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MOCK_CLAIMS.map(claim => (
          <div
            key={claim.id}
            className="card"
            style={{ cursor: 'pointer', borderColor: selected === claim.id ? 'var(--accent)40' : 'var(--border)', transition: 'all 0.2s' }}
            onClick={() => setSelected(selected === claim.id ? null : claim.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 28, lineHeight: 1 }}>{claim.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{claim.type}</span>
                  <span className="badge badge-green">✓ Paid</span>
                  {claim.autoTriggered && <span className="badge badge-blue">⚡ Auto-triggered</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{claim.id} · {new Date(claim.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {claim.zone}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--green)' }}>₹{claim.amount}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>via UPI</div>
              </div>
            </div>

            {/* Expanded detail */}
            {selected === claim.id && (
              <div className="animate-up" style={{ marginTop: 16, padding: 16, background: 'var(--bg3)', borderRadius: 10, fontSize: 13 }}>
                <div style={{ fontWeight: 500, marginBottom: 12, color: 'var(--text2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Claim Pipeline</div>
                {[
                  { step: 'Disruption detected', detail: 'Parametric threshold breached automatically', time: '00:00' },
                  { step: 'Location verified', detail: `GPS confirmed in ${claim.zone} — affected zone`, time: '00:08' },
                  { step: 'Fraud check passed', detail: 'No duplicate claim · Platform activity verified', time: '00:42' },
                  { step: 'Claim approved', detail: 'Auto-approved — no human review needed', time: '01:10' },
                  { step: `UPI payout ₹${claim.amount}`, detail: `Sent to ${worker.upi || 'ravikumar@upi'}`, time: '02:18', highlight: true },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--green)', border: '2px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', flexShrink: 0 }}>✓</div>
                      {i < 4 && <div style={{ width: 1, height: 18, background: 'var(--border2)', marginTop: 2 }} />}
                    </div>
                    <div style={{ paddingBottom: 8 }}>
                      <div style={{ fontWeight: s.highlight ? 600 : 400, color: s.highlight ? 'var(--accent)' : 'var(--text)' }}>{s.step}</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 1 }}>{s.detail}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)', flexShrink: 0 }}>{s.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No fraud note */}
      <div className="card-sm" style={{ background: 'var(--bg3)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 20 }}>🛡️</span>
        <div style={{ fontSize: 13, color: 'var(--text2)' }}>
          All claims verified via GPS location, platform activity data, and duplicate detection. Fraud score: <span style={{ color: 'var(--green)', fontWeight: 600 }}>Clean</span>
        </div>
      </div>
    </div>
  );
}
