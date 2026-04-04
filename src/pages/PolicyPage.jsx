import React from 'react';
import { DISRUPTIONS, ZONES, calculatePremium } from '../data/mockData.js';
import { getCoverageWindow, getPolicyId } from '../lib/appConfig.js';

export default function PolicyPage({ worker }) {
  const zone = ZONES.find(z => z.id === worker.zone) || ZONES[0];
  const { premium, maxPayout } = calculatePremium(worker);
  const { weekStart, weekEnd } = getCoverageWindow();
  const policyId = getPolicyId(worker);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>My Policy</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4 }}>Active weekly income protection</p>
      </div>

      <div className="card" style={{
        borderColor: '#f9731640',
        background: 'linear-gradient(135deg, var(--bg2) 0%, rgba(249,115,22,0.06) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'var(--accent)', opacity: 0.04 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="badge badge-green">● Active</span>
              <span className="badge badge-accent">{worker.coverage?.charAt(0).toUpperCase() + (worker.coverage?.slice(1) || 'standard')} Shield</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              Policy #{policyId}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>
              {weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – {weekEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>Weekly premium</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>₹{premium}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>auto-deducted Mondays</div>
          </div>
        </div>

        <div className="divider" />

        <div className="grid-3">
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Max weekly payout</div>
            <div className="stat-num" style={{ color: 'var(--green)' }}>₹{maxPayout.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Work zone</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{zone.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>Risk: {zone.risk}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Payout channel</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>UPI Instant</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{worker.upi || 'ravikumar@upi'}</div>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>What You're Covered For</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {DISRUPTIONS.map(d => (
            <div key={d.id} className="card-sm" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{d.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>{d.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>{d.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>{d.condition}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', fontSize: 14 }}>₹{d.payout}/day</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>How Your Premium Is Calculated</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Base weekly rate', value: '₹59.00', neutral: true },
            { label: `Zone factor — ${zone.name}`, value: `× ${zone.factor}`, note: zone.risk === 'high' ? 'High flood risk area' : zone.risk === 'medium' ? 'Moderate risk area' : 'Low risk area' },
            { label: 'Season factor (Monsoon)', value: '× 1.30', note: 'Peak disruption season' },
            { label: 'Claim history (No prior claims)', value: '× 0.90', note: 'Clean record discount' },
            { label: 'Coverage tier', value: `× ${worker.coverage === 'basic' ? '0.80' : worker.coverage === 'premium' ? '1.35' : '1.00'}`, note: `${(worker.coverage || 'standard').charAt(0).toUpperCase() + (worker.coverage || 'standard').slice(1)} Shield` },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 13 }}>{r.label}</div>
                {r.note && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{r.note}</div>}
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: r.neutral ? 'var(--text)' : 'var(--text2)', fontSize: 14 }}>{r.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <span style={{ fontWeight: 600 }}>Final weekly premium</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)', fontSize: 20 }}>₹{premium}</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ borderColor: '#ef444430', background: 'var(--redbg)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--red)', marginBottom: 10 }}>Not Covered</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Health & medical bills', 'Life insurance', 'Vehicle repairs', 'Accident damages', 'Personal injury'].map(item => (
            <span key={item} style={{ fontSize: 12, color: 'var(--text2)', padding: '4px 10px', background: 'var(--bg2)', borderRadius: 6, border: '1px solid var(--border)' }}>
              ✕ {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
