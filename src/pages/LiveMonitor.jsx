import React, { useEffect, useState } from 'react';
import { DISRUPTIONS } from '../data/mockData.js';

const LIVE_CONDITIONS = {
  weather: { temp: 38, rainfall: 4, condition: 'Partly Cloudy', humidity: 68, windSpeed: 14 },
  aqi: { value: 187, category: 'Unhealthy', pm25: 142 },
  platform: { swiggy: 'operational', zomato: 'operational', downtimeMinutes: 0 },
  alerts: [],
};

function getSeverity(id, conditions) {
  if (id === 'heavy-rain') {
    if (conditions.weather.rainfall >= 20) return 'triggered';
    if (conditions.weather.rainfall >= 10) return 'warning';
    return 'clear';
  }
  if (id === 'extreme-heat') {
    if (conditions.weather.temp >= 42) return 'triggered';
    if (conditions.weather.temp >= 38) return 'warning';
    return 'clear';
  }
  if (id === 'severe-aqi') {
    if (conditions.aqi.value >= 300) return 'triggered';
    if (conditions.aqi.value >= 200) return 'warning';
    return 'clear';
  }
  if (id === 'platform-outage') {
    if (conditions.platform.downtimeMinutes >= 120) return 'triggered';
    if (conditions.platform.swiggy !== 'operational' || conditions.platform.zomato !== 'operational') return 'warning';
    return 'clear';
  }
  if (id === 'curfew-strike') {
    if (conditions.alerts.includes('curfew') || conditions.alerts.includes('strike')) return 'triggered';
    return 'clear';
  }
  return 'clear';
}

function StatusDot({ status }) {
  const color = status === 'triggered' ? 'var(--red)' : status === 'warning' ? 'var(--yellow)' : 'var(--green)';
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
      {status !== 'clear' && (
        <span style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: color,
          animation: 'ring-pulse 1.5s ease-out infinite',
          opacity: 0.6,
        }} />
      )}
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', position: 'relative' }} />
    </span>
  );
}

export default function LiveMonitor() {
  const [conditions, setConditions] = useState(LIVE_CONDITIONS);
  const [autoClaimEvents, setAutoClaimEvents] = useState([]);
  const [simulating, setSimulating] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setLastUpdated(new Date());
      setConditions(current => ({
        ...current,
        weather: {
          ...current.weather,
          temp: current.weather.temp + (Math.random() - 0.5),
          humidity: Math.min(99, Math.max(30, current.weather.humidity + (Math.random() - 0.5) * 2)),
        },
        aqi: {
          ...current.aqi,
          value: Math.round(current.aqi.value + (Math.random() - 0.5) * 5),
        },
      }));
    }, 8000);

    return () => clearInterval(id);
  }, []);

  function simulateDisruption(id) {
    setSimulating(id);

    let newConditions = { ...conditions };
    if (id === 'heavy-rain') newConditions = { ...conditions, weather: { ...conditions.weather, rainfall: 28, condition: 'Heavy Rain' } };
    if (id === 'extreme-heat') newConditions = { ...conditions, weather: { ...conditions.weather, temp: 44.5 } };
    if (id === 'severe-aqi') newConditions = { ...conditions, aqi: { value: 340, category: 'Hazardous', pm25: 298 } };
    if (id === 'platform-outage') newConditions = { ...conditions, platform: { swiggy: 'down', zomato: 'operational', downtimeMinutes: 145 } };
    if (id === 'curfew-strike') newConditions = { ...conditions, alerts: ['curfew'] };

    setTimeout(() => {
      setConditions(newConditions);
      const disruption = DISRUPTIONS.find(item => item.id === id);
      const event = {
        id: Date.now(),
        disruptionId: id,
        name: disruption.name,
        icon: disruption.icon,
        payout: disruption.payout,
        time: new Date(),
        status: 'processing',
        fraudCheck: 'pending',
      };

      setAutoClaimEvents(prev => [event, ...prev]);

      setTimeout(() => {
        setAutoClaimEvents(prev => prev.map(item => (item.id === event.id ? { ...item, fraudCheck: 'passed' } : item)));
        setTimeout(() => {
          setAutoClaimEvents(prev => prev.map(item => (item.id === event.id ? { ...item, status: 'approved', paidAt: new Date() } : item)));
          setSimulating(null);
        }, 1500);
      }, 2000);
    }, 1000);
  }

  function resetSimulation() {
    setConditions(LIVE_CONDITIONS);
    setAutoClaimEvents([]);
    setSimulating(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Live Disruption Monitor</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4 }}>
            Parametric triggers update in real-time · Last updated {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={resetSimulation}>Reset</button>
          <span className="badge badge-green">● Live</span>
        </div>
      </div>

      <div className="grid-4">
        {[
          { label: 'Temperature', value: `${conditions.weather.temp.toFixed(1)}°C`, warning: conditions.weather.temp >= 38, danger: conditions.weather.temp >= 42 },
          { label: 'Rainfall', value: `${conditions.weather.rainfall} mm/hr`, warning: conditions.weather.rainfall >= 10, danger: conditions.weather.rainfall >= 20 },
          { label: 'AQI Index', value: conditions.aqi.value, warning: conditions.aqi.value >= 200, danger: conditions.aqi.value >= 300 },
          { label: 'Platform Status', value: conditions.platform.swiggy === 'down' ? 'Swiggy DOWN' : 'All Systems OK', warning: false, danger: conditions.platform.swiggy === 'down' },
        ].map(metric => (
          <div key={metric.label} className="card-sm" style={{ borderColor: metric.danger ? '#ef444440' : metric.warning ? '#eab30840' : 'var(--border)' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{metric.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: metric.danger ? 'var(--red)' : metric.warning ? 'var(--yellow)' : 'var(--text)' }}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      <div className="split-panel">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Parametric Triggers</h3>
          {DISRUPTIONS.map(disruption => {
            const severity = getSeverity(disruption.id, conditions);
            const isSimulating = simulating === disruption.id;

            return (
              <div key={disruption.id} className="card" style={{
                borderColor: severity === 'triggered' ? '#ef444450' : severity === 'warning' ? '#eab30840' : 'var(--border)',
                background: severity === 'triggered' ? 'rgba(239,68,68,0.06)' : severity === 'warning' ? 'rgba(234,179,8,0.05)' : 'var(--bg2)',
                transition: 'all 0.4s',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ fontSize: 24, lineHeight: 1 }}>{disruption.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{disruption.name}</span>
                      <StatusDot status={severity} />
                      <span className={`badge ${severity === 'triggered' ? 'badge-red' : severity === 'warning' ? 'badge-yellow' : 'badge-green'}`}>
                        {severity === 'triggered' ? 'TRIGGERED' : severity === 'warning' ? 'WARNING' : 'CLEAR'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>{disruption.condition} · Source: {disruption.source}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>Payout on trigger:</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', fontSize: 15 }}>₹{disruption.payout}/day</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => simulateDisruption(disruption.id)}
                    disabled={!!simulating}
                    style={{ flexShrink: 0, borderColor: 'var(--accent)50', color: 'var(--accent)', fontSize: 12 }}
                  >
                    {isSimulating ? '⏳ Simulating...' : '▶ Simulate'}
                  </button>
                </div>

                {severity === 'triggered' && (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, fontSize: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--green)' }}>✓ GPS location verified in affected zone</span>
                    <span style={{ color: 'var(--green)' }}>✓ No duplicate claim in 24h</span>
                    <span style={{ color: 'var(--green)' }}>✓ Platform activity cross-checked</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Auto-Claim Pipeline</h3>

          {autoClaimEvents.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, border: '1px dashed var(--border2)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
              <div style={{ fontSize: 14, color: 'var(--text2)' }}>No claims yet</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Simulate a disruption to see the zero-touch claim pipeline in action</div>
            </div>
          ) : (
            autoClaimEvents.map(event => (
              <div key={event.id} className="card animate-up" style={{ borderColor: event.status === 'approved' ? '#22c55e40' : '#f9731640' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{event.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{event.name}</span>
                  </div>
                  <span className={`badge ${event.status === 'approved' ? 'badge-green' : 'badge-accent'}`}>
                    {event.status === 'approved' ? '✓ Paid' : '⏳ Processing'}
                  </span>
                </div>

                {[
                  { label: 'Trigger detected', done: true, time: event.time },
                  { label: 'Fraud check', done: event.fraudCheck === 'passed', pending: event.fraudCheck === 'pending' },
                  { label: 'Claim approved', done: event.status === 'approved' },
                  { label: `UPI payout ₹${event.payout}`, done: event.status === 'approved', highlight: true },
                ].map((step, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: index < 3 ? 0 : 8, position: 'relative', paddingBottom: index < 3 ? 12 : 0 }}>
                    {index < 3 && <div style={{ position: 'absolute', left: 9, top: 22, width: 2, height: 10, background: step.done ? 'var(--green)' : 'var(--bg4)' }} />}
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: step.done ? 'var(--green)' : step.pending ? 'var(--yellowbg)' : 'var(--bg4)',
                      border: `2px solid ${step.done ? 'var(--green)' : step.pending ? 'var(--yellow)' : 'var(--border2)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                    }}>
                      {step.done ? '✓' : step.pending ? '⟳' : ''}
                    </div>
                    <span style={{
                      fontSize: 13,
                      color: step.done ? (step.highlight ? 'var(--accent)' : 'var(--text)') : 'var(--text3)',
                      fontWeight: step.done && step.highlight ? 700 : 400,
                    }}>{step.label}</span>
                    {step.done && index === 0 && <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 'auto' }}>{event.time.toLocaleTimeString()}</span>}
                  </div>
                ))}

                {event.status === 'approved' && (
                  <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--greenbg)', borderRadius: 8, fontSize: 12, color: 'var(--green)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>₹{event.payout} sent to UPI</span>
                    <span>~2.3 min total</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
