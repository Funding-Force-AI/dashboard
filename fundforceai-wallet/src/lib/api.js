/**
 * API client for the Funding Force AI frontend.
 *
 * Single shared fetch wrapper with auth cookie support,
 * consistent error handling, and env-based URL config.
 *
 * Import everything from here — no more scattered fetch calls.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (response.status === 401) {
    throw new Error('Not authenticated.')
  }

  if (response.status === 403) {
    throw new Error('You do not have access to this resource.')
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed.')
  }

  return data
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export function loginUser({ email, password }) {
  return api('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function logoutUser() {
  return api('/api/users/logout', { method: 'POST' })
}

export function getCurrentUser() {
  return api('/api/me')
}

// ---------------------------------------------------------------------------
// Users (admin)
// ---------------------------------------------------------------------------

export function getUsers() {
  return api('/api/users')
}

export function createUser(payload) {
  return api('/api/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

export function getClients() {
  return api('/api/portal-clients')
}

export function getClient(clientId) {
  return api(`/api/portal-clients/${encodeURIComponent(clientId)}`)
}

export function createClient(payload) {
  return api('/api/portal-clients', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateClient(clientId, patch) {
  return api(`/api/portal-clients/${encodeURIComponent(clientId)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

export function deleteClient(clientId) {
  return api(`/api/portal-clients/${encodeURIComponent(clientId)}`, {
    method: 'DELETE',
  })
}

// ---------------------------------------------------------------------------
// Metrics (admin)
// ---------------------------------------------------------------------------

export function getMetrics() {
  return api('/api/metrics')
}

// ---------------------------------------------------------------------------
// Disbursements
// ---------------------------------------------------------------------------

export function getDisbursements() {
  return api('/api/disbursements')
}

export function createDisbursement(payload) {
  return api('/api/disbursements', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ---------------------------------------------------------------------------
// Seed (dev only)
// ---------------------------------------------------------------------------

export function seedClients() {
  return api('/api/portal-clients/seed', { method: 'POST' })
}
