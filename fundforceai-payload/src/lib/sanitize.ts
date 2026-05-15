/**
 * Data sanitization utilities.
 *
 * These run server-side BEFORE data leaves the API.
 * Never trust the frontend to mask sensitive fields.
 */

// ---------------------------------------------------------------------------
// EIN masking
// ---------------------------------------------------------------------------

/**
 * Masks an EIN so only the last 4 digits are visible.
 * "82-1749203" → "••-•••9203"
 * Returns "—" if the value is empty/null.
 */
export function maskEin(ein?: string | null): string {
  if (!ein) return '—'
  const digits = ein.replace(/\D/g, '')
  if (digits.length < 4) return '••-•••••••'
  const last4 = digits.slice(-4)
  return `••-•••${last4}`
}

// ---------------------------------------------------------------------------
// Client sanitization
// ---------------------------------------------------------------------------

type SanitizeOptions = {
  /** If true, returns the full EIN (admin view). Default: false (masked). */
  showFullEin?: boolean
}

/**
 * Strips or masks sensitive fields from a client record before
 * returning it through the API.
 */
export function sanitizeClient(client: any, options: SanitizeOptions = {}): any {
  if (!client) return client

  const { showFullEin = false } = options

  return {
    ...client,
    ein: showFullEin ? client.ein : maskEin(client.ein),
  }
}

/**
 * Sanitize an array of client records.
 */
export function sanitizeClients(clients: any[], options: SanitizeOptions = {}): any[] {
  return clients.map((c) => sanitizeClient(c, options))
}
