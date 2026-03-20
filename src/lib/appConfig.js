export const APP_NAME = 'TrueDelivery';
export const APP_TAGLINE = 'Income Protection for Delivery Partners';
export const APP_STORAGE_KEY = 'truedelivery.worker';
export const APP_PAGE_STORAGE_KEY = 'truedelivery.page';
export const MOBILE_BREAKPOINT = 960;

export const DEFAULT_WORKER = {
  name: 'Ravi Kumar',
  phone: '+91 98765 43210',
  upi: 'ravikumar@upi',
  platform: 'swiggy',
  zone: 'hyd-old',
  hoursPerDay: 10,
  avgDailyIncome: 750,
  claims: 0,
  season: 'monsoon',
  coverage: 'standard',
  premium: 89,
  maxPayout: 2700,
  riskScore: 72,
};

const PUBLIC_PAGES = new Set(['onboarding', 'admin']);
const KNOWN_PAGES = new Set([
  'onboarding',
  'policy',
  'monitor',
  'claims',
  'worker-dashboard',
  'admin',
]);

export function loadStoredWorker() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const value = window.localStorage.getItem(APP_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function storeWorker(worker) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (worker) {
      window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(worker));
      return;
    }

    window.localStorage.removeItem(APP_STORAGE_KEY);
  } catch {
    // Ignore storage failures and keep the app usable.
  }
}

export function loadStoredPage(hasWorker) {
  if (typeof window === 'undefined') {
    return hasWorker ? 'worker-dashboard' : 'onboarding';
  }

  try {
    const page = window.localStorage.getItem(APP_PAGE_STORAGE_KEY);
    if (!page || !KNOWN_PAGES.has(page)) {
      return hasWorker ? 'worker-dashboard' : 'onboarding';
    }

    if (!hasWorker && !PUBLIC_PAGES.has(page)) {
      return 'onboarding';
    }

    return page;
  } catch {
    return hasWorker ? 'worker-dashboard' : 'onboarding';
  }
}

export function storePage(page) {
  if (typeof window === 'undefined' || !KNOWN_PAGES.has(page)) {
    return;
  }

  try {
    window.localStorage.setItem(APP_PAGE_STORAGE_KEY, page);
  } catch {
    // Ignore storage failures and keep the app usable.
  }
}

export function clearStoredAppState() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(APP_STORAGE_KEY);
    window.localStorage.removeItem(APP_PAGE_STORAGE_KEY);
  } catch {
    // Ignore storage failures and keep the app usable.
  }
}

export function getCoverageWindow(baseDate = new Date()) {
  const current = new Date(baseDate);
  current.setHours(0, 0, 0, 0);

  const day = current.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const weekStart = new Date(current);
  weekStart.setDate(current.getDate() + diffToMonday);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return { weekStart, weekEnd };
}

export function getPolicyId(worker) {
  const seed = [
    worker?.name,
    worker?.phone,
    worker?.zone,
    worker?.coverage,
  ].filter(Boolean).join('|') || 'demo-worker';

  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % 100000;
  }

  return `TD-${new Date().getFullYear()}-${String(hash).padStart(5, '0')}`;
}
