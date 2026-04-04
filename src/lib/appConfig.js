export const APP_NAME = "TrueDelivery";
export const APP_TAGLINE = "Income Protection for Delivery Partners";
export const APP_STORAGE_KEY = "truedelivery.worker";
export const APP_PAGE_STORAGE_KEY = "truedelivery.page";
export const APP_CLAIMS_STORAGE_KEY = "truedelivery.claims";
export const APP_VIEW_MODE_KEY = "truedelivery.viewMode";
export const APP_ACCESSIBILITY_KEY = "truedelivery.accessibilityMode";
export const MOBILE_BREAKPOINT = 960;

export const DEFAULT_WORKER = {
  name: "Ravi Kumar",
  phone: "+91 98765 43210",
  upi: "ravikumar@upi",
  platform: "swiggy",
  zone: "hyd-old",
  hoursPerDay: 10,
  avgDailyIncome: 750,
  claims: 0,
  season: "monsoon",
  coverage: "standard",
  premium: 89,
  maxPayout: 2700,
  riskScore: 72,
};

const PUBLIC_PAGES = new Set(["onboarding", "admin"]);
const KNOWN_PAGES = new Set([
  "onboarding",
  "policy",
  "monitor",
  "claims",
  "worker-dashboard",
  "admin",
]);

function readStoredJson(key) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeStoredJson(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures and keep the app usable.
  }
}

export function loadStoredWorker() {
  return readStoredJson(APP_STORAGE_KEY);
}

export function storeWorker(worker) {
  writeStoredJson(APP_STORAGE_KEY, worker ?? null);
}

export function loadStoredClaims() {
  return readStoredJson(APP_CLAIMS_STORAGE_KEY);
}

export function storeClaims(claims) {
  writeStoredJson(APP_CLAIMS_STORAGE_KEY, claims ?? null);
}

export function loadStoredViewMode() {
  const storedMode = readStoredJson(APP_VIEW_MODE_KEY);
  return storedMode === "simplified" ? "simplified" : "normal";
}

export function storeViewMode(viewMode) {
  writeStoredJson(
    APP_VIEW_MODE_KEY,
    viewMode === "simplified" ? "simplified" : "normal",
  );
}

export function loadStoredAccessibilityMode() {
  return readStoredJson(APP_ACCESSIBILITY_KEY) === true;
}

export function storeAccessibilityMode(isAccessible) {
  writeStoredJson(APP_ACCESSIBILITY_KEY, Boolean(isAccessible));
}

export function loadStoredPage(hasWorker) {
  if (typeof window === "undefined") {
    return hasWorker ? "worker-dashboard" : "onboarding";
  }

  try {
    const page = window.localStorage.getItem(APP_PAGE_STORAGE_KEY);
    if (!page || !KNOWN_PAGES.has(page)) {
      return hasWorker ? "worker-dashboard" : "onboarding";
    }

    if (!hasWorker && !PUBLIC_PAGES.has(page)) {
      return "onboarding";
    }

    return page;
  } catch {
    return hasWorker ? "worker-dashboard" : "onboarding";
  }
}

export function storePage(page) {
  if (typeof window === "undefined" || !KNOWN_PAGES.has(page)) {
    return;
  }

  try {
    window.localStorage.setItem(APP_PAGE_STORAGE_KEY, page);
  } catch {
    // Ignore storage failures and keep the app usable.
  }
}

export function clearStoredAppState() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(APP_STORAGE_KEY);
    window.localStorage.removeItem(APP_PAGE_STORAGE_KEY);
    window.localStorage.removeItem(APP_CLAIMS_STORAGE_KEY);
    window.localStorage.removeItem(APP_VIEW_MODE_KEY);
    window.localStorage.removeItem(APP_ACCESSIBILITY_KEY);
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
  const seed =
    [worker?.name, worker?.phone, worker?.zone, worker?.coverage]
      .filter(Boolean)
      .join("|") || "demo-worker";

  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % 100000;
  }

  return `TD-${new Date().getFullYear()}-${String(hash).padStart(5, "0")}`;
}
