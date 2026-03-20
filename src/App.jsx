import React, { Suspense, lazy, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import {
  APP_NAME,
  DEFAULT_WORKER,
  MOBILE_BREAKPOINT,
  clearStoredAppState,
  loadStoredPage,
  loadStoredWorker,
  storePage,
  storeWorker,
} from './lib/appConfig.js';

const Onboarding = lazy(() => import('./pages/Onboarding.jsx'));
const PolicyPage = lazy(() => import('./pages/PolicyPage.jsx'));
const LiveMonitor = lazy(() => import('./pages/LiveMonitor.jsx'));
const ClaimsPage = lazy(() => import('./pages/ClaimsPage.jsx'));
const WorkerDashboard = lazy(() => import('./pages/WorkerDashboard.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

const PAGE_LABELS = {
  onboarding: 'Onboarding',
  policy: 'My Policy',
  monitor: 'Live Monitor',
  claims: 'Claims',
  'worker-dashboard': 'Dashboard',
  admin: 'Admin Panel',
};

const PROTECTED_PAGES = new Set(['policy', 'monitor', 'claims', 'worker-dashboard']);

export default function App() {
  const [worker, setWorker] = useState(() => loadStoredWorker());
  const [page, setPage] = useState(() => loadStoredPage(Boolean(loadStoredWorker())));
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);

      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    storeWorker(worker);
  }, [worker]);

  useEffect(() => {
    if (!worker && PROTECTED_PAGES.has(page)) {
      setPage('onboarding');
      return;
    }

    storePage(page);
    document.title = `${APP_NAME} — ${PAGE_LABELS[page] || 'Dashboard'}`;
  }, [page, worker]);

  function handleOnboardComplete(data) {
    setWorker({ ...DEFAULT_WORKER, ...data });
    setPage('worker-dashboard');
    setIsSidebarOpen(false);
  }

  function handleNavigate(nextPage) {
    if (!worker && PROTECTED_PAGES.has(nextPage)) {
      return;
    }

    setPage(nextPage);
    setIsSidebarOpen(false);
  }

  function handleReset() {
    clearStoredAppState();
    setWorker(null);
    setPage('onboarding');
    setIsSidebarOpen(false);
  }

  const effectiveWorker = worker || DEFAULT_WORKER;

  const renderPage = () => {
    switch (page) {
      case 'onboarding':
        return worker
          ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Already onboarded!</h2>
              <p style={{ color: 'var(--text2)', marginBottom: 20 }}>You're covered as {worker.name}</p>
              <button className="btn btn-primary" onClick={() => handleNavigate('worker-dashboard')}>Go to Dashboard</button>
            </div>
            )
          : <Onboarding onComplete={handleOnboardComplete} />;
      case 'policy':
        return <PolicyPage worker={effectiveWorker} />;
      case 'monitor':
        return <LiveMonitor />;
      case 'claims':
        return <ClaimsPage worker={effectiveWorker} />;
      case 'worker-dashboard':
        return <WorkerDashboard worker={effectiveWorker} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Onboarding onComplete={handleOnboardComplete} />;
    }
  };

  return (
    <div className="app-shell noise">
      {isMobile && isSidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {isMobile && (
        <div className="mobile-topbar">
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{APP_NAME}</div>
            <div style={{ color: 'var(--text3)', fontSize: 12 }}>{PAGE_LABELS[page]}</div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen(prev => !prev)}
          >
            Menu
          </button>
        </div>
      )}

      <Sidebar
        active={page}
        onNav={handleNavigate}
        workerOnboarded={!!worker}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onReset={handleReset}
      />

      <main className="app-main">
        <Suspense fallback={<div className="card animate-fade" style={{ maxWidth: 360 }}>Loading page...</div>}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  );
}
