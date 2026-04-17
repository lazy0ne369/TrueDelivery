import React from 'react';
import { Home, ShieldCheck, Radar, ReceiptText, LayoutDashboard, Settings2, RefreshCcw } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../lib/appConfig.js';

const navItems = [
  { id: 'onboarding', icon: Home, label: 'Start here', description: 'Create or review your profile' },
  { id: 'policy', icon: ShieldCheck, label: 'My policy', description: 'See what is covered' },
  { id: 'monitor', icon: Radar, label: 'Live monitor', description: 'Watch triggers and alerts' },
  { id: 'claims', icon: ReceiptText, label: 'Claims', description: 'Review payouts and history' },
  { id: 'worker-dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Today’s summary and insights' },
  { id: 'admin', icon: Settings2, label: 'Admin panel', description: 'Portfolio and system status' },
];

export default function Sidebar({ active, onNav, workerOnboarded, viewMode, onToggleViewMode, accessibilityMode, onToggleAccessibilityMode, isMobile, isOpen, onClose, onReset }) {
  return (
    <aside className={`sidebar-shell${isMobile && isOpen ? ' is-open' : ''}`}>
      <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 16,
                color: '#fff',
              }}
            >
              {APP_NAME.charAt(0)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--text)', lineHeight: 1.1 }}>
                {APP_NAME}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', marginTop: 3 }}>{APP_TAGLINE}</div>
            </div>
          </div>
          {isMobile && (
            <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close navigation">
              ×
            </button>
          )}
        </div>
      </div>

      <nav style={{ flex: 1, padding: '14px 12px 12px' }}>
        {navItems.map(item => {
          const isLocked = !workerOnboarded && !['onboarding', 'admin'].includes(item.id);
          const isActive = active === item.id;
          const Icon = item.icon;

          return (
            <button
              type="button"
              key={item.id}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => !isLocked && onNav(item.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                width: '100%',
                padding: '11px 12px',
                marginBottom: 6,
                borderRadius: 14,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                background: isActive ? 'linear-gradient(135deg, rgba(255, 138, 61, 0.18), rgba(255, 138, 61, 0.08))' : 'transparent',
                color: isLocked ? 'var(--text3)' : isActive ? 'var(--text)' : 'var(--text2)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                textAlign: 'left',
                transition: 'all 0.15s',
                border: `1px solid ${isActive ? 'rgba(255, 138, 61, 0.26)' : 'transparent'}`,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive ? 'rgba(255, 138, 61, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  color: isLocked ? 'var(--text3)' : isActive ? 'var(--accent)' : 'var(--text2)',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
                <span>{item.label}</span>
                <span style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.35 }}>{item.description}</span>
              </span>
              {isLocked && <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)', flexShrink: 0 }}>Locked</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            View mode
          </div>
          <button
            type="button"
            className="view-mode-switch"
            onClick={onToggleViewMode}
            aria-pressed={viewMode === 'simplified'}
            style={{ width: '100%' }}
          >
            <span className={`view-mode-pill${viewMode === 'normal' ? ' is-active' : ''}`}>Normal</span>
            <span className={`view-mode-pill${viewMode === 'simplified' ? ' is-active' : ''}`}>Simplified</span>
          </button>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, lineHeight: 1.45 }}>
            Simplified mode hides extra copy and trims dense sections.
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Accessibility
          </div>
          <button
            type="button"
            className="view-mode-switch"
            onClick={onToggleAccessibilityMode}
            aria-pressed={accessibilityMode}
            style={{ width: '100%' }}
          >
            <span className={`view-mode-pill${!accessibilityMode ? ' is-active' : ''}`}>Off</span>
            <span className={`view-mode-pill${accessibilityMode ? ' is-active' : ''}`}>On</span>
          </button>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, lineHeight: 1.45 }}>
            Larger type, stronger contrast, and less motion.
          </div>
        </div>

        <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.55 }}>
          <div style={{ color: 'var(--text2)', marginBottom: 6 }}>Hyderabad, IN</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--green)' }}>●</span>
            <span>Live monitoring active</span>
          </div>
          <div style={{ marginTop: 8, color: 'var(--text2)' }}>
            Plain-language coverage, direct payouts, and clear next steps.
          </div>
        </div>
        {workerOnboarded && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onReset}
            style={{ marginTop: 14, width: '100%' }}
          >
            <RefreshCcw size={14} /> Reset demo
          </button>
        )}
      </div>
    </aside>
  );
}
