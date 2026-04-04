async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.');
  }

  return payload;
}

export function fetchBootstrap() {
  return request('/api/bootstrap');
}

export function saveWorkerProfile(worker) {
  return request('/api/worker', {
    method: 'PUT',
    body: JSON.stringify(worker),
  });
}

export function simulateDisruptionRequest(disruptionId) {
  return request('/api/simulate-disruption', {
    method: 'POST',
    body: JSON.stringify({ disruptionId }),
  });
}

export function resetDemoRequest() {
  return request('/api/reset-demo', {
    method: 'POST',
  });
}
