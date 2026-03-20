import React, { useState } from 'react';
import { ZONES, calculatePremium, getRiskScore } from '../data/mockData.js';
import { APP_NAME } from '../lib/appConfig.js';

const STEPS = ['Personal Info', 'Work Profile', 'Risk Assessment', 'Review'];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', phone: '', aadhar: '', upi: '',
    platform: 'swiggy', zone: 'hyd-old',
    hoursPerDay: 10, yearsExp: 1,
    avgDailyIncome: 750, claims: 0,
    season: 'monsoon', coverage: 'standard',
  });
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const riskScore = getRiskScore(form);
  const { premium, maxPayout, zone } = calculatePremium(form);

  function handleVerify() {
    setVerifying(true);
    setTimeout(() => { setVerifying(false); setVerified(true); }, 1800);
  }

  function handleSubmit() {
    setDone(true);
    setTimeout(() => onComplete({ ...form, premium, maxPayout, riskScore }), 2000);
  }

  if (done) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, animation: 'fade-in 0.5s ease' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--greenbg)', border: '2px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>✓</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>You're covered!</h2>
      <p style={{ color: 'var(--text2)', textAlign: 'center' }}>{APP_NAME} is now active. Your first week's coverage starts today.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Get Covered in Minutes</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Income protection for Swiggy & Zomato delivery partners</p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 14, left: '5%', right: '5%', height: 1, background: 'var(--border2)' }} />
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: i < step ? 'var(--green)' : i === step ? 'var(--accent)' : 'var(--bg3)',
              border: `2px solid ${i < step ? 'var(--green)' : i === step ? 'var(--accent)' : 'var(--border2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600, color: i <= step ? '#fff' : 'var(--text3)',
              transition: 'all 0.3s',
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 11, color: i === step ? 'var(--text)' : 'var(--text3)', fontWeight: i === step ? 500 : 400 }}>{s}</span>
          </div>
        ))}
      </div>

      {/* Step 0: Personal Info */}
      {step === 0 && (
        <div className="animate-up card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Personal Information</h3>
          <div className="grid-2">
            <div>
              <label>Full Name</label>
              <input placeholder="Ravi Kumar" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label>Mobile Number</label>
              <input placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>
          <div>
            <label>Aadhaar Number (for KYC)</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input placeholder="XXXX XXXX XXXX" value={form.aadhar} onChange={e => set('aadhar', e.target.value)} style={{ flex: 1 }} />
              <button className="btn btn-ghost btn-sm" onClick={handleVerify} disabled={verifying || verified} style={{ whiteSpace: 'nowrap', minWidth: 100 }}>
                {verifying ? 'Verifying...' : verified ? '✓ Verified' : 'Verify KYC'}
              </button>
            </div>
            {verified && <p style={{ fontSize: 12, color: 'var(--green)', marginTop: 6 }}>✓ Aadhaar verified successfully</p>}
          </div>
          <div>
            <label>UPI ID (for instant payouts)</label>
            <input placeholder="ravikumar@upi" value={form.upi} onChange={e => set('upi', e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => setStep(1)} style={{ alignSelf: 'flex-end' }}>
            Continue →
          </button>
        </div>
      )}

      {/* Step 1: Work Profile */}
      {step === 1 && (
        <div className="animate-up card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Work Profile</h3>
          <div className="grid-2">
            <div>
              <label>Delivery Platform</label>
              <select value={form.platform} onChange={e => set('platform', e.target.value)}>
                <option value="swiggy">Swiggy</option>
                <option value="zomato">Zomato</option>
                <option value="both">Both Swiggy & Zomato</option>
              </select>
            </div>
            <div>
              <label>Primary Work Zone</label>
              <select value={form.zone} onChange={e => set('zone', e.target.value)}>
                {ZONES.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div>
              <label>Hours worked per day</label>
              <select value={form.hoursPerDay} onChange={e => set('hoursPerDay', +e.target.value)}>
                {[6,8,10,12,14].map(h => <option key={h} value={h}>{h} hours</option>)}
              </select>
            </div>
            <div>
              <label>Average daily income</label>
              <select value={form.avgDailyIncome} onChange={e => set('avgDailyIncome', +e.target.value)}>
                <option value={500}>₹400–600</option>
                <option value={750}>₹600–900</option>
                <option value={1000}>₹900–1,200</option>
                <option value={1300}>₹1,200+</option>
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div>
              <label>Years of experience</label>
              <select value={form.yearsExp} onChange={e => set('yearsExp', +e.target.value)}>
                <option value={0}>Less than 1 year</option>
                <option value={1}>1–2 years</option>
                <option value={3}>3–5 years</option>
                <option value={5}>5+ years</option>
              </select>
            </div>
            <div>
              <label>Prior claims (past 6 months)</label>
              <select value={form.claims} onChange={e => set('claims', +e.target.value)}>
                <option value={0}>None</option>
                <option value={1}>1 claim</option>
                <option value={2}>2 claims</option>
                <option value={3}>3+ claims</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(2)}>Continue →</button>
          </div>
        </div>
      )}

      {/* Step 2: Risk Assessment */}
      {step === 2 && (
        <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>AI Risk Assessment</h3>
            {/* Risk score visual */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
              <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                <svg viewBox="0 0 90 90" width="90" height="90">
                  <circle cx="45" cy="45" r="36" fill="none" stroke="var(--bg4)" strokeWidth="8" />
                  <circle cx="45" cy="45" r="36" fill="none"
                    stroke={riskScore > 70 ? 'var(--red)' : riskScore > 45 ? 'var(--yellow)' : 'var(--green)'}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(riskScore / 100) * 226} 226`}
                    transform="rotate(-90 45 45)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: riskScore > 70 ? 'var(--red)' : riskScore > 45 ? 'var(--yellow)' : 'var(--green)' }}>{riskScore}</span>
                  <span style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase' }}>Risk Score</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>
                  {riskScore > 70 ? 'High Risk Profile' : riskScore > 45 ? 'Moderate Risk Profile' : 'Low Risk Profile'}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
                  Based on your zone ({zone?.name}), work hours, and claim history. This score determines your weekly premium dynamically.
                </p>
              </div>
            </div>

            {/* Factor breakdown */}
            {[
              { label: 'Zone flood risk', value: zone?.risk, color: zone?.risk === 'high' ? 'var(--red)' : zone?.risk === 'medium' ? 'var(--yellow)' : 'var(--green)' },
              { label: 'Season risk', value: form.season === 'monsoon' ? 'High (Monsoon)' : 'Moderate', color: form.season === 'monsoon' ? 'var(--red)' : 'var(--yellow)' },
              { label: 'Claim history', value: form.claims === 0 ? 'Clean (No claims)' : `${form.claims} prior claims`, color: form.claims === 0 ? 'var(--green)' : 'var(--yellow)' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>{f.label}</span>
                <span className="badge" style={{ background: 'transparent', color: f.color, border: `1px solid ${f.color}40`, textTransform: 'capitalize' }}>{f.value}</span>
              </div>
            ))}
          </div>

          {/* Choose coverage */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Select Coverage Plan</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'basic', name: 'Basic Shield', price: Math.round(premium * 0.8), maxP: 1800, desc: '2 disruption days covered/week' },
                { id: 'standard', name: 'Standard Shield', price: premium, maxP: 2700, desc: '3 disruption days covered/week', recommended: true },
                { id: 'premium', name: 'Full Shield', price: Math.round(premium * 1.35), maxP: 4000, desc: '5 disruption days + priority payout' },
              ].map(plan => (
                <button
                  key={plan.id}
                  onClick={() => set('coverage', plan.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 10,
                    border: `1.5px solid ${form.coverage === plan.id ? 'var(--accent)' : 'var(--border)'}`,
                    background: form.coverage === plan.id ? 'var(--accentbg)' : 'var(--bg3)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${form.coverage === plan.id ? 'var(--accent)' : 'var(--border2)'}`, background: form.coverage === plan.id ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {form.coverage === plan.id && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--text)' }}>{plan.name}</span>
                      {plan.recommended && <span className="badge badge-accent" style={{ fontSize: 9 }}>Recommended</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{plan.desc} · Max ₹{plan.maxP.toLocaleString()}/week</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>₹{plan.price}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>/week</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>Review Policy →</button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>Policy Summary</h3>
            {[
              { label: 'Name', value: form.name || 'Ravi Kumar' },
              { label: 'Platform', value: form.platform === 'both' ? 'Swiggy + Zomato' : form.platform.charAt(0).toUpperCase() + form.platform.slice(1) },
              { label: 'Work zone', value: ZONES.find(z => z.id === form.zone)?.name },
              { label: 'Coverage plan', value: form.coverage.charAt(0).toUpperCase() + form.coverage.slice(1) + ' Shield' },
              { label: 'Max weekly payout', value: `₹${maxPayout.toLocaleString()}` },
              { label: 'Payout channel', value: `UPI (${form.upi || 'ravikumar@upi'})` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}

            {/* Price highlight */}
            <div style={{ marginTop: 20, padding: 18, background: 'var(--accentbg)', borderRadius: 10, border: '1px solid var(--accent)40', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>Weekly premium</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Auto-deducted every Monday</div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--accent)' }}>₹{premium}</span>
                <span style={{ fontSize: 13, color: 'var(--text3)' }}>/week</span>
              </div>
            </div>
          </div>

          <div style={{ padding: 14, background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>
            By activating, you confirm that claims trigger automatically based on verified parametric events. Income loss only — health, accidents & vehicle repairs are excluded.
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <button className="btn btn-primary" onClick={handleSubmit} style={{ gap: 8 }}>
              Activate {APP_NAME} ⚡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
