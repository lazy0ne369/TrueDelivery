import React, { Suspense, lazy, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import { DISRUPTIONS, LIVE_CONDITIONS } from './data/mockData.js';
import {
  fetchBootstrap,
  resetDemoRequest,
  saveWorkerProfile,
  simulateDisruptionRequest,
} from './lib/api.js';
import { normalizeClaims } from './lib/demoState.js';
import {
  APP_NAME,
  DEFAULT_WORKER,
  MOBILE_BREAKPOINT,
  clearStoredAppState,
  loadStoredAccessibilityMode,
  loadStoredClaims,
  loadStoredPage,
  loadStoredWorker,
  loadStoredViewMode,
  storeClaims,
  storeAccessibilityMode,
  storePage,
  storeWorker,
  storeViewMode,
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
const DEFAULT_DISRUPTION_STATUSES = DISRUPTIONS.map(disruption => ({
  ...disruption,
  status: 'clear',
}));

export default function App() {
  const storedWorker = loadStoredWorker();
  const [worker, setWorker] = useState(() => storedWorker);
  const [page, setPage] = useState(() => loadStoredPage(Boolean(storedWorker)));
  const [claims, setClaims] = useState(() => normalizeClaims(loadStoredClaims()));
  const [viewMode, setViewMode] = useState(() => loadStoredViewMode());
  const [accessibilityMode, setAccessibilityMode] = useState(() => loadStoredAccessibilityMode());
  const [alerts, setAlerts] = useState([]);
  const [monitorEvents, setMonitorEvents] = useState([]);
  const [liveConditions, setLiveConditions] = useState(LIVE_CONDITIONS);
  const [disruptionStatuses, setDisruptionStatuses] = useState(DEFAULT_DISRUPTION_STATUSES);
  const [workerInsights, setWorkerInsights] = useState([]);
  const [adminSummary, setAdminSummary] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [apiError, setApiError] = useState('');
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function applySnapshot(snapshot) {
    setWorker(snapshot.worker || null);
    setClaims(normalizeClaims(snapshot.claims || []));
    setAlerts(snapshot.alerts || []);
    setMonitorEvents(snapshot.monitorEvents || []);
    setLiveConditions(snapshot.liveConditions || LIVE_CONDITIONS);
    setDisruptionStatuses(snapshot.disruptionStatuses || DEFAULT_DISRUPTION_STATUSES);
    setWorkerInsights(snapshot.workerInsights || []);
    setAdminSummary(snapshot.adminSummary || null);
    setLastSyncedAt(snapshot.updatedAt || null);
  }

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
    let cancelled = false;

    async function bootstrap() {
      try {
        const snapshot = await fetchBootstrap();
        if (!cancelled) {
          applySnapshot(snapshot);
          if (snapshot.worker && page === 'onboarding') {
            setPage('worker-dashboard');
          }
          setApiError('');
        }
      } catch {
        if (!cancelled) {
          setApiError('Action 2 backend is offline. Start `npm run dev:full` to enable API-driven features.');
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    storeWorker(worker);
  }, [worker]);

  useEffect(() => {
    storeClaims(claims);
  }, [claims]);

  useEffect(() => {
    storeViewMode(viewMode);
  }, [viewMode]);

  useEffect(() => {
    storeAccessibilityMode(accessibilityMode);
  }, [accessibilityMode]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.viewMode = viewMode;
    }
  }, [viewMode]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.accessibility = accessibilityMode ? 'true' : 'false';
    }
  }, [accessibilityMode]);

  useEffect(() => {
    if (!worker && PROTECTED_PAGES.has(page)) {
      setPage('onboarding');
      return;
    }

    storePage(page);
    document.title = `${APP_NAME} - ${PAGE_LABELS[page] || 'Dashboard'}`;
  }, [page, worker]);

  async function handleOnboardComplete(data) {
    const fallbackWorker = { ...DEFAULT_WORKER, ...data };
    setIsSyncing(true);

    try {
      const snapshot = await saveWorkerProfile(fallbackWorker);
      applySnapshot(snapshot);
      setApiError('');
    } catch {
      setWorker(fallbackWorker);
      setClaims([]);
      setAlerts([]);
      setMonitorEvents([]);
      setWorkerInsights([]);
      setDisruptionStatuses(DEFAULT_DISRUPTION_STATUSES);
      setApiError('Saved locally only because the backend is offline.');
    } finally {
      setPage('worker-dashboard');
      setIsSidebarOpen(false);
      setIsSyncing(false);
    }
  }

  function handleNavigate(nextPage) {
    if (!worker && PROTECTED_PAGES.has(nextPage)) {
      return;
    }

    setPage(nextPage);
    setIsSidebarOpen(false);
  }

  async function handleReset() {
    clearStoredAppState();
    setViewMode('normal');
    setAccessibilityMode(false);
    setIsSyncing(true);

    try {
      const snapshot = await resetDemoRequest();
      applySnapshot(snapshot);
      setApiError('');
    } catch {
      setWorker(null);
      setClaims([]);
      setAlerts([]);
      setMonitorEvents([]);
      setLiveConditions(LIVE_CONDITIONS);
      setDisruptionStatuses(DEFAULT_DISRUPTION_STATUSES);
      setWorkerInsights([]);
      setAdminSummary(null);
    } finally {
      setPage('onboarding');
      setIsSidebarOpen(false);
      setIsSyncing(false);
    }
  }

  function handleToggleViewMode() {
    setViewMode(currentMode => (currentMode === 'simplified' ? 'normal' : 'simplified'));
  }

  function handleToggleAccessibilityMode() {
    setAccessibilityMode(currentMode => !currentMode);
  }

  async function handleSimulateDisruption(disruptionId) {
    setIsSyncing(true);

    try {
      const snapshot = await simulateDisruptionRequest(disruptionId);
      applySnapshot(snapshot);
      setApiError('');
      return snapshot;
    } finally {
      setIsSyncing(false);
    }
  }

  const effectiveWorker = worker || DEFAULT_WORKER;

  const renderPage = () => {
    if (isBootstrapping) {
      return (
        <div className="card animate-fade" style={{ maxWidth: 420 }}>
          Syncing demo state from the backend...
        </div>
      );
    }

    switch (page) {
      case 'onboarding':
        return worker ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 14, letterSpacing: '0.12em', color: 'var(--green)', marginBottom: 16 }}>ACTIVE</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Already onboarded</h2>
            <p style={{ color: 'var(--text2)', marginBottom: 20 }}>The current demo policy belongs to {worker.name}.</p>
            <button className="btn btn-primary" onClick={() => handleNavigate('worker-dashboard')}>Go to Dashboard</button>
          </div>
        ) : <Onboarding onComplete={handleOnboardComplete} />;
      case 'policy':
        return <PolicyPage worker={effectiveWorker} alerts={alerts} apiConnected={!apiError} />;
      case 'monitor':
        return (
          <LiveMonitor
            worker={effectiveWorker}
            alerts={alerts}
            conditions={liveConditions}
            disruptionStatuses={disruptionStatuses}
            monitorEvents={monitorEvents}
            syncPending={isSyncing}
            lastSyncedAt={lastSyncedAt}
            apiConnected={!apiError}
            onSimulateDisruption={handleSimulateDisruption}
          />
        );
      case 'claims':
        return <ClaimsPage worker={effectiveWorker} claims={claims} />;
      case 'worker-dashboard':
        return (
          <WorkerDashboard
            worker={effectiveWorker}
            claims={claims}
            alerts={alerts}
            insights={workerInsights}
            apiConnected={!apiError}
            lastSyncedAt={lastSyncedAt}
          />
        );
      case 'admin':
        return (
          <AdminDashboard
            summary={adminSummary}
            alerts={alerts}
            apiConnected={!apiError}
            lastSyncedAt={lastSyncedAt}
          />
        );
      default:
        return <Onboarding onComplete={handleOnboardComplete} />;
    }
  };

  return (
    <div className={`app-shell noise${viewMode === 'simplified' ? ' is-simplified' : ''}${accessibilityMode ? ' is-accessible' : ''}`}>
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
        workerOnboarded={Boolean(worker)}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        accessibilityMode={accessibilityMode}
        onToggleAccessibilityMode={handleToggleAccessibilityMode}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onReset={handleReset}
      />

      <main className="app-main">
        {apiError && (
          <div className="card-sm" style={{ marginBottom: 16, borderColor: 'rgba(234,179,8,0.35)', background: 'rgba(234,179,8,0.08)', color: 'var(--text2)' }}>
            {apiError}
          </div>
        )}

        <Suspense fallback={<div className="card animate-fade" style={{ maxWidth: 360 }}>Loading page...</div>}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  );
}
