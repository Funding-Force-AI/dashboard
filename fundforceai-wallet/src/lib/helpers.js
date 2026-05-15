/**
 * Shared utility functions for the Funding Force AI frontend.
 *
 * Import from here instead of redefining in each file.
 */

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/**
 * Format a number as USD currency.
 * @param {number} value
 * @param {boolean} compact - Use compact notation ("$2.8M" vs "$2,800,000")
 */
export function money(value, compact = false) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(Number(value || 0))
}

/**
 * Get initials from a name string.
 * "Marcus Greene" → "MG"
 */
export function initials(name) {
  return String(name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

/** Normalize a status string for comparison. */
export function normalizeStatus(status) {
  return String(status || '').trim().toLowerCase()
}

/**
 * Normalize a client record from the API to the shape
 * the frontend components expect.
 */
export function normalizeClient(client) {
  return {
    ...client,
    payloadId: client.payloadId || client.id,
    id: client.externalId || client.id,
    vendors: client.vendors || [],
    history: client.history || [],
  }
}

// ---------------------------------------------------------------------------
// Client data helpers
// ---------------------------------------------------------------------------

/** Get funding statistics for a client's vendors. */
export function getClientFundingStats(client) {
  const vendors = client?.vendors || []

  const totalPlanned = vendors.reduce(
    (sum, vendor) => sum + Number(vendor.amount || 0),
    0,
  )

  const completedTotal = vendors
    .filter((vendor) => normalizeStatus(vendor.status) === 'completed')
    .reduce((sum, vendor) => sum + Number(vendor.amount || 0), 0)

  const pendingTotal = totalPlanned - completedTotal

  const completedCount = vendors.filter(
    (vendor) => normalizeStatus(vendor.status) === 'completed',
  ).length

  return {
    vendors,
    totalPlanned,
    completedTotal,
    pendingTotal,
    completedCount,
  }
}

/** Build a deployment scenario projection from client data. */
export function buildScenario(client) {
  const vendors = client?.vendors || []

  const totalPlanned = vendors.reduce(
    (sum, vendor) => sum + Number(vendor.amount || 0),
    0,
  )

  const deployAmount = totalPlanned || 7300
  const revenueLift = Math.round(deployAmount * 3.2)
  const revenueLow = Math.round(revenueLift * 0.62)
  const revenueHigh = Math.round(revenueLift * 1.4)
  const costOfCapital = Math.round(deployAmount * 0.18)
  const netEquityGain = revenueLift - costOfCapital
  const dailyAch = Math.max(
    1,
    Math.round((deployAmount + costOfCapital) / 180),
  )

  return {
    todayScore: 67,
    day90Score: 78,
    scoreGain: 11,
    deployAmount,
    revenueLift,
    revenueRange: `${money(revenueLow, true)}–${money(revenueHigh, true)}`,
    netEquityGain,
    costOfCapital,
    dailyAch,
    dailyAchTerm: '~180 days',
  }
}

/** Get the total planned capital for a client. */
export function getClientTotal(client) {
  const vendors = client?.vendors || []
  return vendors.reduce((sum, vendor) => sum + Number(vendor.amount || 0), 0)
}

/** Get the display name for a user's relatedClient. */
export function getRelatedClientName(user) {
  const relatedClient = user?.relatedClient
  if (!relatedClient) return '—'
  if (typeof relatedClient === 'object') {
    return relatedClient.name || relatedClient.externalId || relatedClient.id
  }
  return relatedClient
}
