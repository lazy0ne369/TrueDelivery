import React from 'react';
import { APP_NAME } from '../lib/appConfig.js';

const navItems = [
  { id: 'onboarding', icon: '◍', label: 'Onboarding' },
  { id: 'policy', icon: '⬡', label: 'My Policy' },
  { id: 'monitor', icon: '◉', label: 'Live Monitor' },
  { id: 'claims', icon: '◈', label: 'Claims' },
  { id: 'worker-dashboard', icon: '▣', label: 'My Dashboard' },
  { id: 'admin', icon: '♦', label: 'Admin Panel' },
];

export default function Sidebar({ active, onNav, workerOnboarded, isMobile, isOpen, onClose, onReset }) {
  return (
    <aside className={`sidebar-shell${isMobile && isOpen ? ' is-open' : ''}`}>
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 16,
              color: '#fff',
            }}>{APP_NAME.charAt(0)}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)', lineHeight: 1 }}>{APP_NAME}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', marginTop: 2 }}>INCOME PROTECTION</div>
            </div>
          </div>
          {isMobile && (
            <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close navigation">
              ×
            </button>
          )}
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 12px' }}>
        {navItems.map(item => {
          const isLocked = !workerOnboarded && !['onboarding', 'admin'].includes(item.id);
          const isActive = active === item.id;

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => !isLocked && onNav(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 12px',
                marginBottom: 2,
                borderRadius: 8,
                border: 'none',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                background: isActive ? 'var(--accentbg)' : 'transparent',
                color: isLocked ? 'var(--text3)' : isActive ? 'var(--accent)' : 'var(--text2)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                textAlign: 'left',
                transition: 'all 0.15s',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              <span style={{ fontSize: 14, opacity: isLocked ? 0.4 : 1 }}>{item.icon}</span>
              <span>{item.label}</span>
              {isLocked && <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.4 }}>🔒</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>
          Hyderabad, IN<br />
          <span style={{ color: 'var(--green)' }}>●</span> Live monitoring active
        </div>
        {workerOnboarded && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onReset}
            style={{ marginTop: 14, width: '100%' }}
          >
            Restart Demo
          </button>
        )}
      </div>
    </aside>
  );
}
