/**
 * Input validation for API mutations.
 *
 * Returns an error string if invalid, or null if valid.
 * Keep validators pure — no side effects, no DB calls.
 */

// ---------------------------------------------------------------------------
// Client validation
// ---------------------------------------------------------------------------

const VALID_CLIENT_STATUSES = ['Selected', 'Ready', 'Review', 'Pending', 'Completed'] as const

export function validateCreateClient(body: any): string | null {
  if (!body) return 'Request body is required'
  if (!body.externalId || typeof body.externalId !== 'string') return 'externalId is required (string)'
  if (!body.name || typeof body.name !== 'string') return 'name is required (string)'
  if (body.email && typeof body.email !== 'string') return 'email must be a string'
  if (body.status && !VALID_CLIENT_STATUSES.includes(body.status)) {
    return `status must be one of: ${VALID_CLIENT_STATUSES.join(', ')}`
  }
  if (body.totalAllocation !== undefined && (typeof body.totalAllocation !== 'number' || body.totalAllocation < 0)) {
    return 'totalAllocation must be a non-negative number'
  }
  return null
}

export function validateUpdateClient(body: any): string | null {
  if (!body || typeof body !== 'object') return 'Request body is required'
  if (body.status && !VALID_CLIENT_STATUSES.includes(body.status)) {
    return `status must be one of: ${VALID_CLIENT_STATUSES.join(', ')}`
  }
  if (body.totalAllocation !== undefined && (typeof body.totalAllocation !== 'number' || body.totalAllocation < 0)) {
    return 'totalAllocation must be a non-negative number'
  }
  // Don't allow changing externalId via update
  if (body.externalId !== undefined) return 'Cannot change externalId after creation'
  return null
}

// ---------------------------------------------------------------------------
// Disbursement validation
// ---------------------------------------------------------------------------

const VALID_PURPOSES = [
  'marketing',
  'google_ads',
  'seo',
  'web_dev',
  'lead_gen',
  'consulting',
  'other',
] as const

const PURPOSE_ALIASES: Record<string, string> = {
  Marketing: 'marketing',
  'Google Ads': 'google_ads',
  'Meta Ads': 'marketing',
  'Local SEO': 'seo',
  'SMS/email campaign': 'marketing',
  'Booking page rebuild': 'web_dev',
  'Lead generation': 'lead_gen',
  'Creative services': 'marketing',
  Consulting: 'consulting',
  Other: 'other',
}

export function normalizePurpose(purpose?: string): string {
  if (!purpose) return 'other'
  // Direct match
  if ((VALID_PURPOSES as readonly string[]).includes(purpose)) return purpose
  // Alias match
  return PURPOSE_ALIASES[purpose] || 'other'
}

export function validateCreateDisbursement(body: any): string | null {
  if (!body) return 'Request body is required'
  if (!body.clientId) return 'clientId is required'
  if (!body.clientName) return 'clientName is required'
  if (!body.vendorId) return 'vendorId is required'
  if (!body.vendorName) return 'vendorName is required'
  if (!body.amountCents || typeof body.amountCents !== 'number') return 'amountCents is required (number)'
  if (body.amountCents <= 0) return 'amountCents must be greater than 0'
  if (!body.purpose) return 'purpose is required'

  const normalized = normalizePurpose(body.purpose)
  if (!(VALID_PURPOSES as readonly string[]).includes(normalized)) {
    return `Invalid purpose. Must be one of: ${VALID_PURPOSES.join(', ')}`
  }

  return null
}

// ---------------------------------------------------------------------------
// User validation
// ---------------------------------------------------------------------------

const VALID_ROLES = ['super_admin', 'admin', 'client'] as const

export function validateCreateUser(body: any): string | null {
  if (!body) return 'Request body is required'
  if (!body.email || typeof body.email !== 'string') return 'email is required (string)'
  if (!body.password || typeof body.password !== 'string') return 'password is required (string)'
  if (body.password.length < 8) return 'password must be at least 8 characters'
  if (body.role && !VALID_ROLES.includes(body.role)) {
    return `role must be one of: ${VALID_ROLES.join(', ')}`
  }
  return null
}
