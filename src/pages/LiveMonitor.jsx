import React, { useState } from 'react';

function StatusDot({ status }) {
  const color = status === 'triggered' ? 'var(--red)' : status === 'warning' ? 'var(--yellow)' : 'var(--green)';

  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
      {status !== 'clear' && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: color,
            animation: 'ring-pulse 1.5s ease-out infinite',
            opacity: 0.6,
          }}
        />
      )}
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', position: 'relative' }} />
    </span>
  );
}

function getPipelineBadge(status) {
  if (status === 'approved') {
    return { className: 'badge badge-green', label: 'Paid' };
  }

  if (status === 'blocked') {
    return { className: 'badge badge-red', label: 'Blocked' };
  }

  return { className: 'badge badge-accent', label: 'Processing' };
}

function getPipelineSteps(event) {
  return [
    { label: 'Trigger detected', done: true },
    {
      label: event.status === 'blocked' ? 'Duplicate rule check' : 'Fraud check',
      done: event.fraudCheck === 'passed',
      failed: event.fraudCheck === 'blocked',
    },
    {
      label: event.status === 'blocked' ? 'Claim blocked' : 'Claim approved',
      done: event.status === 'approved',
      failed: event.status === 'blocked',
    },
    {
      label: `UPI payout Rs.${event.payout}`,
      done: event.status === 'approved',
      disabled: event.status === 'blocked',
      highlight: true,
    },
  ];
}

export default function LiveMonitor({
  worker,
  alerts,
  conditions,
  disruptionStatuses,
  monitorEvents,
  syncPending,
  lastSyncedAt,
  apiConnected,
  onSimulateDisruption,
}) {
  const [simulating, setSimulating] = useState(null);
  const [error, setError] = useState('');

  async function handleSimulate(disruptionId) {
    if (simulating || syncPending) {
      return;
    }

    setSimulating(disruptionId);
    setError('');

    try {
      await onSimulateDisruption(disruptionId);
    } catch (simulationError) {
      setError(simulationError.message || 'Simulation failed.');
    } finally {
      setSimulating(null);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="page-kicker">Live conditions</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Live monitor</h1>
            <p className="page-lead">
              Simulate a disruption to see how the system checks the trigger, approves or blocks the claim, and
              records the payout.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span className={apiConnected ? 'badge badge-green' : 'badge badge-yellow'}>
              {apiConnected ? 'API connected' : 'Fallback mode'}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>
              {lastSyncedAt ? `Last sync ${new Date(lastSyncedAt).toLocaleTimeString('en-IN')}` : 'Waiting for first sync'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="card-sm" style={{ borderColor: 'rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.08)', color: 'var(--text2)' }}>
          {error}
        </div>
      )}

      <div className="grid-4">
        {[
          {
            label: 'Temperature',
            value: `${conditions.weather.temp.toFixed(1)} C`,
            warning: conditions.weather.temp >= 38,
            danger: conditions.weather.temp >= 42,
          },
          {
            label: 'Rainfall',
            value: `${conditions.weather.rainfall} mm/hr`,
            warning: conditions.weather.rainfall >= 10,
            danger: conditions.weather.rainfall >= 20,
          },
          {
            label: 'AQI Index',
            value: conditions.aqi.value,
            warning: conditions.aqi.value >= 200,
            danger: conditions.aqi.value >= 300,
          },
          {
            label: 'Platform status',
            value: conditions.platform.swiggy === 'down' ? 'Swiggy degraded' : 'All systems OK',
            warning: false,
            danger: conditions.platform.swiggy === 'down',
          },
        ].map(metric => (
          <div
            key={metric.label}
            className="card-sm"
            style={{ borderColor: metric.danger ? 'rgba(239,68,68,0.3)' : metric.warning ? 'rgba(234,179,8,0.3)' : 'var(--border)' }}
          >
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              {metric.label}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: metric.danger ? 'var(--red)' : metric.warning ? 'var(--yellow)' : 'var(--text)' }}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      <div className="split-panel">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Parametric Triggers
          </h3>
          {disruptionStatuses.map(disruption => {
            const severity = disruption.status;
            const isSimulating = simulating === disruption.id;

            return (
              <div
                key={disruption.id}
                className="card"
                style={{
                  borderColor: severity === 'triggered' ? 'rgba(239,68,68,0.38)' : severity === 'warning' ? 'rgba(234,179,8,0.3)' : 'var(--border)',
                  background: severity === 'triggered' ? 'rgba(239,68,68,0.06)' : severity === 'warning' ? 'rgba(234,179,8,0.05)' : 'var(--bg2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ fontSize: 24, lineHeight: 1 }}>{disruption.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{disruption.name}</span>
                      <StatusDot status={severity} />
                      <span className={`badge ${severity === 'triggered' ? 'badge-red' : severity === 'warning' ? 'badge-yellow' : 'badge-green'}`}>
                        {severity === 'triggered' ? 'Triggered' : severity === 'warning' ? 'Warning' : 'Clear'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>
                      {disruption.condition} - Source: {disruption.source}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>Payout on trigger:</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', fontSize: 15 }}>
                        Rs.{disruption.payout}/day
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleSimulate(disruption.id)}
                    disabled={Boolean(simulating) || syncPending}
                    style={{ flexShrink: 0, borderColor: 'rgba(249,115,22,0.38)', color: 'var(--accent)', fontSize: 12 }}
                  >
                    {isSimulating ? 'Simulating...' : 'Simulate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Auto-Claim Pipeline
          </h3>

          {monitorEvents.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 14, color: 'var(--text2)' }}>No backend events yet</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                Simulate a disruption to create a claim decision for {worker.name}.
              </div>
            </div>
          ) : (
            monitorEvents.map(event => {
              const badge = getPipelineBadge(event.status);
              return (
                <div
                  key={event.id}
                  className="card animate-up"
                  style={{ borderColor: event.status === 'blocked' ? 'rgba(239,68,68,0.3)' : event.status === 'approved' ? 'rgba(34,197,94,0.3)' : 'rgba(249,115,22,0.28)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{event.icon}</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{event.name}</span>
                    </div>
                    <span className={badge.className}>{badge.label}</span>
                  </div>

                  {getPipelineSteps(event).map(step => (
                    <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          flexShrink: 0,
                          background: step.done ? 'var(--green)' : step.failed ? 'var(--redbg)' : 'var(--bg4)',
                          border: `2px solid ${step.done ? 'var(--green)' : step.failed ? 'var(--red)' : 'var(--border2)'}`,
                        }}
                      />
                      <span style={{ fontSize: 13, color: step.done ? (step.highlight ? 'var(--accent)' : 'var(--text)') : step.failed ? 'var(--red)' : 'var(--text3)', fontWeight: step.done && step.highlight ? 700 : 400 }}>
                        {step.label}
                      </span>
                    </div>
                  ))}

                  <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text3)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{new Date(event.time).toLocaleString('en-IN')}</span>
                    <span>{event.status === 'approved' ? `Paid to ${worker.upi}` : 'Duplicate prevented'}</span>
                  </div>
                </div>
              );
            })
          )}

          <div className="card simplify-hide">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Recent Alert Feed</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alerts.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>No alerts yet.</div>
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
      </div>
    </div>
  );
}
