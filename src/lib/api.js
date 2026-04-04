const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(
  /\/$/,
  "",
);

function buildUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!API_BASE_URL) {
    return normalizedPath;
  }

  // Avoid /api/api/* when base URL already includes /api
  if (API_BASE_URL.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${API_BASE_URL}${normalizedPath.slice(4)}`;
  }

  return `${API_BASE_URL}${normalizedPath}`;
}

async function request(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload;
}

export function fetchBootstrap() {
  return request("/api/bootstrap");
}

export function saveWorkerProfile(worker) {
  return request("/api/worker", {
    method: "PUT",
    body: JSON.stringify(worker),
  });
}

export function simulateDisruptionRequest(disruptionId) {
  return request("/api/simulate-disruption", {
    method: "POST",
    body: JSON.stringify({ disruptionId }),
  });
}

export function resetDemoRequest() {
  return request("/api/reset-demo", {
    method: "POST",
  });
}
