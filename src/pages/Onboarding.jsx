import React, { useState } from 'react';
import { ZONES, calculatePremium, getRiskScore } from '../data/mockData.js';
import { APP_NAME } from '../lib/appConfig.js';

const STEPS = ['Personal Info', 'Work Profile', 'Risk Assessment', 'Review'];

const PLAN_CONFIG = [
  { id: 'basic', name: 'Basic Shield', description: '2 disruption days covered each week' },
  { id: 'standard', name: 'Standard Shield', description: '3 disruption days with balanced coverage', recommended: true },
  { id: 'premium', name: 'Full Shield', description: '5 disruption days plus priority payout' },
];

function formatAadhaar(value) {
  const digits = value.replace(/\D/g, '').slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function isValidUpi(value) {
  return /^[a-z0-9._-]{2,}@[a-z]{2,}$/i.test(value.trim());
}

function getPhoneDigits(value) {
  return value.replace(/\D/g, '').slice(-10);
}

function getAadhaarDigits(value) {
  return value.replace(/\D/g, '');
}

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 6 }}>{message}</p>;
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    aadhar: '',
    upi: '',
    platform: 'swiggy',
    zone: 'hyd-old',
    hoursPerDay: 10,
    yearsExp: 1,
    avgDailyIncome: 750,
    claims: 0,
    season: 'monsoon',
    coverage: 'standard',
  });
  const [errors, setErrors] = useState({});
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [done, setDone] = useState(false);

  function setField(key, value) {
    setForm(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));

    if (key === 'aadhar') {
      setVerified(false);
    }
  }

  const riskScore = getRiskScore(form);
  const selectedQuote = calculatePremium(form);
  const planOptions = PLAN_CONFIG.map(plan => ({
    ...plan,
    ...calculatePremium({ ...form, coverage: plan.id }),
  }));
  const selectedPlan = planOptions.find(plan => plan.id === form.coverage) || planOptions[1];
  const summaryHighlights = [
    { label: 'Direct UPI payout', value: 'No manual follow-up' },
    { label: 'Auto claim checks', value: 'Less paperwork' },
    { label: 'Coverage match', value: `${selectedPlan.maxPayout.toLocaleString()} max payout` },
  ];

  function validateCurrentStep() {
    if (step !== 0) {
      return true;
    }

    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Enter your full name to continue.';
    }

    if (getPhoneDigits(form.phone).length !== 10) {
      nextErrors.phone = 'Enter a valid 10-digit mobile number.';
    }

    if (getAadhaarDigits(form.aadhar).length !== 12) {
      nextErrors.aadhar = 'Enter a valid 12-digit Aadhaar number.';
    } else if (!verified) {
      nextErrors.aadhar = 'Verify your Aadhaar before continuing.';
    }

    if (!isValidUpi(form.upi)) {
      nextErrors.upi = 'Enter a valid UPI ID like name@bank.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleVerify() {
    if (getAadhaarDigits(form.aadhar).length !== 12) {
      setErrors(current => ({
        ...current,
        aadhar: 'Enter a valid 12-digit Aadhaar number before verifying.',
      }));
      return;
    }

    setErrors(current => ({ ...current, aadhar: undefined }));
    setVerifying(true);

    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1400);
  }

  function handleNextStep(nextStep) {
    if (!validateCurrentStep()) {
      return;
    }

    setStep(nextStep);
  }

  function handleSubmit() {
    if (!validateCurrentStep()) {
      setStep(0);
      return;
    }

    setDone(true);
    setTimeout(() => {
      onComplete({
        ...form,
        name: form.name.trim(),
        phone: getPhoneDigits(form.phone),
        aadhar: formatAadhaar(form.aadhar),
        upi: form.upi.trim().toLowerCase(),
        premium: selectedQuote.premium,
        maxPayout: selectedQuote.maxPayout,
        riskScore,
      });
    }, 1400);
  }

  if (done) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 16,
          animation: 'fade-in 0.5s ease',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--greenbg)',
            border: '2px solid var(--green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}
        >
          ✓
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>You&apos;re covered.</h2>
        <p style={{ color: 'var(--text2)', textAlign: 'center' }}>
          {APP_NAME} is active and your first week of protection starts now.
        </p>
      </div>
    );
  }

  return (
    <div className="page-shell" style={{ maxWidth: 1040, margin: '0 auto' }}>
      <div className="page-hero">
        <div className="grid-2" style={{ alignItems: 'center', gap: 18 }}>
          <div>
            <div className="page-kicker">Simple weekly protection</div>
            <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Get covered without the confusing parts.</h1>
            <p className="page-lead">
              TrueDelivery turns delivery setbacks into clear, automatic protection. The form is short, the payout path
              is direct, and the policy summary stays easy to understand.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {summaryHighlights.map(item => (
                <span key={item.label} className="badge badge-blue" style={{ textTransform: 'none', letterSpacing: 0, padding: '6px 12px' }}>
                  {item.label}: {item.value}
                </span>
              ))}
            </div>
          </div>

          <div className="card-sm simplify-hide" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live quote</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800, color: 'var(--accent)', lineHeight: 1.1 }}>
                  ₹{selectedPlan.premium}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Max payout</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--green)' }}>
                  ₹{selectedPlan.maxPayout.toLocaleString()}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.55 }}>
              The recommended plan is already selected, and the quote updates as you change your work zone, season,
              and claim history.
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: 32, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 14, left: '5%', right: '5%', height: 1, background: 'var(--border2)' }} />
        {STEPS.map((label, index) => (
          <div
            key={label}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1 }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: index < step ? 'var(--green)' : index === step ? 'var(--accent)' : 'var(--bg3)',
                border: `2px solid ${index < step ? 'var(--green)' : index === step ? 'var(--accent)' : 'var(--border2)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 600,
                color: index <= step ? '#fff' : 'var(--text3)',
                transition: 'all 0.3s',
              }}
            >
              {index < step ? '✓' : index + 1}
            </div>
            <span style={{ fontSize: 11, color: index === step ? 'var(--text)' : 'var(--text3)', fontWeight: index === step ? 500 : 400 }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="animate-up card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Personal Information</h3>
          <div className="grid-2">
            <div>
              <label>Full Name</label>
              <input placeholder="Ravi Kumar" value={form.name} onChange={event => setField('name', event.target.value)} />
              <FieldError message={errors.name} />
            </div>
            <div>
              <label>Mobile Number</label>
              <input placeholder="+91 98765 43210" value={form.phone} onChange={event => setField('phone', event.target.value)} />
              <FieldError message={errors.phone} />
            </div>
          </div>
          <div>
            <label>Aadhaar Number</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                placeholder="1234 5678 9012"
                value={form.aadhar}
                onChange={event => setField('aadhar', formatAadhaar(event.target.value))}
                style={{ flex: 1 }}
              />
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleVerify}
                disabled={verifying || verified}
                style={{ whiteSpace: 'nowrap', minWidth: 108 }}
              >
                {verifying ? 'Verifying...' : verified ? 'Verified' : 'Verify KYC'}
              </button>
            </div>
            <FieldError message={errors.aadhar} />
            {verified && <p style={{ fontSize: 12, color: 'var(--green)', marginTop: 6 }}>Aadhaar verified successfully.</p>}
          </div>
          <div>
            <label>UPI ID</label>
            <input placeholder="ravikumar@upi" value={form.upi} onChange={event => setField('upi', event.target.value)} />
            <FieldError message={errors.upi} />
          </div>
          <button className="btn btn-primary" onClick={() => handleNextStep(1)} style={{ alignSelf: 'flex-end' }}>
            Continue →
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-up card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Work Profile</h3>
          <div className="grid-2">
            <div>
              <label>Delivery Platform</label>
              <select value={form.platform} onChange={event => setField('platform', event.target.value)}>
                <option value="swiggy">Swiggy</option>
                <option value="zomato">Zomato</option>
                <option value="both">Both Swiggy and Zomato</option>
              </select>
            </div>
            <div>
              <label>Primary Work Zone</label>
              <select value={form.zone} onChange={event => setField('zone', event.target.value)}>
                {ZONES.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label>Hours Worked Per Day</label>
              <select value={form.hoursPerDay} onChange={event => setField('hoursPerDay', Number(event.target.value))}>
                {[6, 8, 10, 12, 14].map(hours => (
                  <option key={hours} value={hours}>
                    {hours} hours
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Average Daily Income</label>
              <select value={form.avgDailyIncome} onChange={event => setField('avgDailyIncome', Number(event.target.value))}>
                <option value={500}>₹400-600</option>
                <option value={750}>₹600-900</option>
                <option value={1000}>₹900-1,200</option>
                <option value={1300}>₹1,200+</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label>Years of Experience</label>
              <select value={form.yearsExp} onChange={event => setField('yearsExp', Number(event.target.value))}>
                <option value={0}>Less than 1 year</option>
                <option value={1}>1-2 years</option>
                <option value={3}>3-5 years</option>
                <option value={5}>5+ years</option>
              </select>
            </div>
            <div>
              <label>Season Exposure</label>
              <select value={form.season} onChange={event => setField('season', event.target.value)}>
                <option value="monsoon">Monsoon</option>
                <option value="summer">Summer</option>
                <option value="winter">Winter</option>
              </select>
            </div>
          </div>

          <div>
            <label>Prior Claims in the Last 6 Months</label>
            <select value={form.claims} onChange={event => setField('claims', Number(event.target.value))}>
              <option value={0}>None</option>
              <option value={1}>1 claim</option>
              <option value={2}>2 claims</option>
              <option value={3}>3 or more claims</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
            <button className="btn btn-primary" onClick={() => handleNextStep(2)}>Continue →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>AI Risk Assessment</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
              <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                <svg viewBox="0 0 90 90" width="90" height="90">
                  <circle cx="45" cy="45" r="36" fill="none" stroke="var(--bg4)" strokeWidth="8" />
                  <circle
                    cx="45"
                    cy="45"
                    r="36"
                    fill="none"
                    stroke={riskScore > 70 ? 'var(--red)' : riskScore > 45 ? 'var(--yellow)' : 'var(--green)'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(riskScore / 100) * 226} 226`}
                    transform="rotate(-90 45 45)"
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      fontWeight: 700,
                      color: riskScore > 70 ? 'var(--red)' : riskScore > 45 ? 'var(--yellow)' : 'var(--green)',
                    }}
                  >
                    {riskScore}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase' }}>Risk Score</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>
                  {riskScore > 70 ? 'High risk profile' : riskScore > 45 ? 'Moderate risk profile' : 'Low risk profile'}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
                  Your quote updates instantly based on zone, season, work hours, and prior claim history.
                </p>
              </div>
            </div>

            {[
              {
                label: 'Zone risk',
                value: `${selectedQuote.zone.name} (${selectedQuote.zone.risk})`,
                color: selectedQuote.zone.risk === 'high' ? 'var(--red)' : selectedQuote.zone.risk === 'medium' ? 'var(--yellow)' : 'var(--green)',
              },
              {
                label: 'Season factor',
                value: `${form.season.charAt(0).toUpperCase() + form.season.slice(1)} × ${selectedQuote.seasonFactor.toFixed(2)}`,
                color: form.season === 'monsoon' ? 'var(--red)' : form.season === 'summer' ? 'var(--yellow)' : 'var(--green)',
              },
              {
                label: 'Claim history',
                value: form.claims === 0 ? 'Clean record discount active' : `${form.claims} recent claims`,
                color: form.claims === 0 ? 'var(--green)' : 'var(--yellow)',
              },
            ].map(factor => (
              <div key={factor.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>{factor.label}</span>
                <span
                  className="badge"
                  style={{
                    background: 'transparent',
                    color: factor.color,
                    border: `1px solid ${factor.color === 'var(--red)' ? '#ef444440' : factor.color === 'var(--yellow)' ? '#eab30840' : '#22c55e40'}`,
                    textTransform: 'capitalize',
                  }}
                >
                  {factor.value}
                </span>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Select Coverage Plan</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {planOptions.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setField('coverage', plan.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 16px',
                    borderRadius: 10,
                    border: `1.5px solid ${form.coverage === plan.id ? 'var(--accent)' : 'var(--border)'}`,
                    background: form.coverage === plan.id ? 'var(--accentbg)' : 'var(--bg3)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: `2px solid ${form.coverage === plan.id ? 'var(--accent)' : 'var(--border2)'}`,
                      background: form.coverage === plan.id ? 'var(--accent)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {form.coverage === plan.id && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--text)' }}>{plan.name}</span>
                      {plan.recommended && <span className="badge badge-accent" style={{ fontSize: 9 }}>Recommended</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
                      {plan.description} · Max ₹{plan.maxPayout.toLocaleString()}/week
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>₹{plan.premium}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>/week</div>
                  </div>
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                padding: 18,
                background: 'var(--accentbg)',
                borderRadius: 10,
                border: '1px solid rgba(249,115,22,0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>Selected plan</div>
                <div style={{ fontWeight: 600, marginTop: 4 }}>{selectedPlan.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--accent)' }}>
                  ₹{selectedPlan.premium}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>max payout ₹{selectedPlan.maxPayout.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={() => handleNextStep(3)}>Review Policy →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>Policy Summary</h3>
            {[
              { label: 'Name', value: form.name || 'Ravi Kumar' },
              { label: 'Platform', value: form.platform === 'both' ? 'Swiggy + Zomato' : form.platform.charAt(0).toUpperCase() + form.platform.slice(1) },
              { label: 'Work zone', value: selectedQuote.zone.name },
              { label: 'Coverage plan', value: `${selectedPlan.name}` },
              { label: 'Max weekly payout', value: `₹${selectedPlan.maxPayout.toLocaleString()}` },
              { label: 'Payout channel', value: `UPI (${form.upi || 'ravikumar@upi'})` },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)', gap: 16 }}>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'right' }}>{row.value}</span>
              </div>
            ))}

            <div
              style={{
                marginTop: 20,
                padding: 18,
                background: 'var(--accentbg)',
                borderRadius: 10,
                border: '1px solid rgba(249,115,22,0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>Weekly premium</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Auto-deducted every Monday</div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--accent)' }}>₹{selectedPlan.premium}</span>
                <span style={{ fontSize: 13, color: 'var(--text3)' }}>/week</span>
              </div>
            </div>
          </div>

          <div style={{ padding: 14, background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>
            Claims trigger automatically based on verified parametric events. Income loss is covered, but health, accidents, and vehicle repairs are excluded.
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <button className="btn btn-primary" onClick={handleSubmit} style={{ gap: 8 }}>
              Activate {APP_NAME}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
