/**
 * GET    /api/portal-clients/:id — get one client by externalId
 * PATCH  /api/portal-clients/:id — update a client (admin+ only)
 * DELETE /api/portal-clients/:id — delete a client (super_admin only)
 *
 * All lookups go through externalId (the public-facing FF-XXXX id),
 * not the internal Payload DB id.
 */

import {
  withAuth,
  withCors,
  apiJson,
  apiError,
  isSuperAdminOrAdmin,
  isClient,
  getRelatedClientId,
} from '@/lib/apiHandler'
import { sanitizeClient } from '@/lib/sanitize'
import { validateUpdateClient } from '@/lib/validate'
import type { Payload } from 'payload'

// ---------------------------------------------------------------------------
// Helper: find by externalId with access control
// ---------------------------------------------------------------------------

async function findByExternalId(payload: Payload, externalId: string, user: any) {
  const result = await payload.find({
    collection: 'clients',
    where: { externalId: { equals: externalId } },
    limit: 1,
    overrideAccess: false,
    user,
  })
  return result.docs[0] || null
}

// ---------------------------------------------------------------------------
// Route params type
// ---------------------------------------------------------------------------

type RouteContext = {
  params: Promise<{ id: string }>
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

export const OPTIONS = withCors()

// ---- GET: single client ----
export const GET = withAuth([], async ({ payload, user, request }) => {
  const url = new URL(request.url)
  const segments = url.pathname.split('/')
  const externalId = segments[segments.length - 1]

  // Client-role users can only see their own relatedClient
  if (isClient(user)) {
    const relatedId = getRelatedClientId(user)
    // For client role, we need to verify after lookup
  }

  const client = await findByExternalId(payload, externalId, user)

  if (!client) {
    return apiError('Client not found', 404)
  }

  // Additional check: client-role can only see their own record
  if (isClient(user)) {
    const relatedId = getRelatedClientId(user)
    if (!relatedId || String(client.id) !== String(relatedId)) {
      return apiError('Client not found', 404)
    }
  }

  const showFullEin = isSuperAdminOrAdmin(user)
  return apiJson({ ok: true, client: sanitizeClient(client, { showFullEin }) })
})

// ---- PATCH: update client ----
export const PATCH = withAuth(['super_admin', 'admin'], async ({ payload, user, request }) => {
  const url = new URL(request.url)
  const segments = url.pathname.split('/')
  const externalId = segments[segments.length - 1]

  const body = await request.json()

  const validationError = validateUpdateClient(body)
  if (validationError) {
    return apiError(validationError, 400)
  }

  const client = await findByExternalId(payload, externalId, user)
  if (!client) {
    return apiError('Client not found', 404)
  }

  const updated = await payload.update({
    collection: 'clients',
    id: client.id,
    data: body,
    overrideAccess: false,
    user,
  })

  return apiJson({ ok: true, message: 'Client updated', client: sanitizeClient(updated, { showFullEin: true }) })
})

// ---- DELETE: delete client ----
export const DELETE = withAuth(['super_admin'], async ({ payload, user, request }) => {
  const url = new URL(request.url)
  const segments = url.pathname.split('/')
  const externalId = segments[segments.length - 1]

  const client = await findByExternalId(payload, externalId, user)
  if (!client) {
    return apiError('Client not found', 404)
  }

  await payload.delete({
    collection: 'clients',
    id: client.id,
    overrideAccess: false,
    user,
  })

  return apiJson({ ok: true, message: 'Client deleted', deletedExternalId: externalId })
})
