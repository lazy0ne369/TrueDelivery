import { MOCK_CLAIMS, ZONES } from '../data/mockData.js';

function cloneClaim(claim) {
  return { ...claim };
}

function sortClaimsNewestFirst(claims) {
  return [...claims].sort((left, right) => new Date(right.date) - new Date(left.date));
}

export function createInitialClaims() {
  return sortClaimsNewestFirst(MOCK_CLAIMS.map(cloneClaim));
}

export function normalizeClaims(storedClaims) {
  if (!Array.isArray(storedClaims)) {
    return [];
  }

  return sortClaimsNewestFirst(
    storedClaims
      .filter(claim => claim && claim.id && claim.date)
      .map(cloneClaim),
  );
}

export function getZoneName(zoneId) {
  return ZONES.find(zone => zone.id === zoneId)?.name || ZONES[0].name;
}

export function getClaimStats(claims) {
  const totalPaid = claims.reduce((sum, claim) => sum + claim.amount, 0);
  return {
    totalPaid,
    totalClaims: claims.length,
    avgClaimTime: claims.length > 0 ? '2.3 min' : 'No claims yet',
  };
}

export function buildRecentActivity({ claims, premium, alerts = [] }) {
  const claimActivities = sortClaimsNewestFirst(claims)
    .slice(0, 2)
    .map(claim => ({
      id: claim.id,
      label: `Claim paid - ${claim.type}`,
      detail: `Rs.${claim.amount} sent to ${claim.recipientUpi || 'UPI account'}`,
      time: new Date(claim.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      }),
      tone: 'good',
    }));

  const alertActivities = alerts.slice(0, 2).map(alert => ({
    id: alert.id,
    label: alert.title,
    detail: alert.message,
    time: new Date(alert.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    }),
    tone: alert.severity,
  }));

  return [
    {
      id: 'premium-deduction',
      label: 'Weekly premium scheduled',
      detail: `Rs.${premium} is deducted at the start of each policy week.`,
      time: 'This week',
      tone: 'neutral',
    },
    ...claimActivities,
    ...alertActivities,
  ].slice(0, 4);
}
