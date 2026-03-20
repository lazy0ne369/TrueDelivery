// Mock data store for the TrueDelivery prototype

export const DISRUPTIONS = [
  {
    id: 'heavy-rain',
    name: 'Heavy Rain',
    icon: '🌧️',
    color: 'var(--blue)',
    bg: 'var(--bluebg)',
    condition: 'Rainfall ≥ 20mm/hr or Red Alert',
    source: 'OpenWeather API',
    payout: 500,
    threshold: { rainfall: 20, alert: 'red' },
    description: 'Covers income lost when heavy rainfall halts deliveries',
  },
  {
    id: 'extreme-heat',
    name: 'Extreme Heat',
    icon: '☀️',
    color: 'var(--yellow)',
    bg: 'var(--yellowbg)',
    condition: 'Temp ≥ 42°C + Heat advisory',
    source: 'OpenWeather API',
    payout: 350,
    threshold: { temp: 42 },
    description: 'Covers income lost during dangerous heat advisories',
  },
  {
    id: 'severe-aqi',
    name: 'Severe Pollution',
    icon: '🌫️',
    color: 'var(--red)',
    bg: 'var(--redbg)',
    condition: 'AQI ≥ 300 (Hazardous)',
    source: 'CPCB / AQICN API',
    payout: 400,
    threshold: { aqi: 300 },
    description: 'Covers income lost when hazardous air quality prevents safe work',
  },
  {
    id: 'platform-outage',
    name: 'Platform Outage',
    icon: '📵',
    color: 'var(--purple)',
    bg: 'var(--purplebg)',
    condition: 'Swiggy/Zomato down ≥ 2 hrs',
    source: 'StatusPage mock API',
    payout: 300,
    threshold: { duration: 120 },
    description: 'Covers income lost when delivery app is unavailable',
  },
  {
    id: 'curfew-strike',
    name: 'Curfew / Strike',
    icon: '🚧',
    color: 'var(--accent)',
    bg: 'var(--accentbg)',
    condition: 'Govt alert or verified zone closure',
    source: 'Govt. alert API',
    payout: 600,
    threshold: { zones: 3 },
    description: 'Covers income lost due to civil disruptions blocking access',
  },
];

export const ZONES = [
  { id: 'hyd-old', name: 'Old City / Charminar', risk: 'high', floodRisk: 1.25, factor: 1.2 },
  { id: 'hyd-banjara', name: 'Banjara Hills', risk: 'low', floodRisk: 0.7, factor: 0.85 },
  { id: 'hyd-gachibowli', name: 'Gachibowli / Hitech City', risk: 'medium', floodRisk: 0.9, factor: 0.95 },
  { id: 'hyd-lb-nagar', name: 'LB Nagar', risk: 'high', floodRisk: 1.3, factor: 1.25 },
  { id: 'hyd-secunderabad', name: 'Secunderabad', risk: 'medium', floodRisk: 1.0, factor: 1.0 },
  { id: 'hyd-kondapur', name: 'Kondapur / Madhapur', risk: 'low', floodRisk: 0.75, factor: 0.88 },
];

export const MOCK_LIVE_DATA = {
  weather: { temp: 38, rainfall: 4, condition: 'Partly Cloudy', humidity: 68 },
  aqi: { value: 187, category: 'Unhealthy', city: 'Hyderabad' },
  platform: { swiggy: 'operational', zomato: 'operational' },
  alerts: [],
};

export const MOCK_CLAIMS = [
  {
    id: 'CLM-2024-001',
    type: 'Heavy Rain',
    icon: '🌧️',
    date: '2024-12-18',
    status: 'paid',
    amount: 500,
    daysAffected: 1,
    autoTriggered: true,
    payoutChannel: 'UPI',
    zone: 'Old City / Charminar',
  },
  {
    id: 'CLM-2024-002',
    type: 'Platform Outage',
    icon: '📵',
    date: '2024-12-10',
    status: 'paid',
    amount: 300,
    daysAffected: 1,
    autoTriggered: true,
    payoutChannel: 'UPI',
    zone: 'Gachibowli',
  },
  {
    id: 'CLM-2024-003',
    type: 'Severe Pollution',
    icon: '🌫️',
    date: '2024-11-28',
    status: 'paid',
    amount: 400,
    daysAffected: 1,
    autoTriggered: true,
    payoutChannel: 'UPI',
    zone: 'Old City / Charminar',
  },
];

export const ADMIN_STATS = {
  totalWorkers: 4284,
  activePolices: 3891,
  totalPremiumCollected: 312400,
  totalPayouts: 228600,
  lossRatio: 73.2,
  fraudPrevented: 47,
  avgClaimTime: '2.3 min',
  weeklyNewSignups: 134,
  claimsByType: [
    { name: 'Heavy Rain', value: 38, color: 'var(--blue)' },
    { name: 'Curfew/Strike', value: 22, color: 'var(--accent)' },
    { name: 'Pollution', value: 18, color: 'var(--red)' },
    { name: 'Platform Outage', value: 14, color: 'var(--purple)' },
    { name: 'Extreme Heat', value: 8, color: 'var(--yellow)' },
  ],
  weeklyData: [
    { week: 'W1 Nov', premium: 48200, payouts: 31400, claims: 84 },
    { week: 'W2 Nov', premium: 49800, payouts: 38200, claims: 102 },
    { week: 'W3 Nov', premium: 51200, payouts: 29800, claims: 79 },
    { week: 'W4 Nov', premium: 52400, payouts: 52100, claims: 138 },
    { week: 'W1 Dec', premium: 54100, payouts: 41800, claims: 112 },
    { week: 'W2 Dec', premium: 56700, payouts: 35300, claims: 94 },
  ],
  riskZones: [
    { zone: 'Old City', riskScore: 88, activePolicies: 612, claims: 41 },
    { zone: 'LB Nagar', riskScore: 82, activePolicies: 489, claims: 34 },
    { zone: 'Secunderabad', riskScore: 61, activePolicies: 718, claims: 22 },
    { zone: 'Gachibowli', riskScore: 44, activePolicies: 934, claims: 14 },
    { zone: 'Banjara Hills', riskScore: 31, activePolicies: 548, claims: 8 },
    { zone: 'Kondapur', riskScore: 28, activePolicies: 590, claims: 7 },
  ],
};

export function calculatePremium(profile) {
  const base = 59; // ₹59 base
  const zone = ZONES.find(z => z.id === profile.zone) || ZONES[0];
  const seasonFactor = profile.season === 'monsoon' ? 1.3 : profile.season === 'summer' ? 1.15 : 0.9;
  const historyFactor = profile.claims === 0 ? 0.9 : profile.claims <= 2 ? 1.0 : 1.15;
  const coverageFactor = profile.coverage === 'basic' ? 0.8 : profile.coverage === 'standard' ? 1.0 : 1.35;

  const premium = Math.round(base * zone.factor * seasonFactor * historyFactor * coverageFactor);
  const maxPayout = profile.coverage === 'basic' ? 1800 : profile.coverage === 'standard' ? 2700 : 4000;

  return { premium, maxPayout, zoneFactor: zone.factor, seasonFactor, historyFactor, zone };
}

export function getRiskScore(profile) {
  const zone = ZONES.find(z => z.id === profile.zone) || ZONES[0];
  let score = 50;
  score += (zone.floodRisk - 1) * 30;
  if (profile.season === 'monsoon') score += 20;
  if (profile.season === 'summer') score += 10;
  if (profile.claims > 2) score += 15;
  if (profile.hoursPerDay > 10) score -= 5;
  return Math.min(95, Math.max(15, Math.round(score)));
}
