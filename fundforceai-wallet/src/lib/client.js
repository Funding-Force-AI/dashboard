const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    throw new Error("Not authenticated.");
  }

  if (res.status === 403) {
    throw new Error("You do not have access to this resource.");
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed.");
  }

  return data;
}

export async function getClients() {
  return apiRequest("/api/portal-clients");
}

export async function getClient(clientId) {
  return apiRequest(`/api/portal-clients/${encodeURIComponent(clientId)}`);
}

export async function createClient(payload) {
  return apiRequest("/api/portal-clients", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateClient(clientId, patch) {
  return apiRequest(`/api/portal-clients/${encodeURIComponent(clientId)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteClient(clientId) {
  return apiRequest(`/api/portal-clients/${encodeURIComponent(clientId)}`, {
    method: "DELETE",
  });
}
