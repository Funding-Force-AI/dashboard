/**
 * GET  /api/portal-clients — list clients (auth required)
 * POST /api/portal-clients — create a client (admin+ only)
 *
 * For client-role users, Payload's collection access control
 * automatically scopes the query to only their relatedClient
 * because we pass `overrideAccess: false, user`.
 */

import {
  withAuth,
  withCors,
  apiJson,
  apiError,
  isSuperAdminOrAdmin,
} from '@/lib/apiHandler'
import { sanitizeClients } from '@/lib/sanitize'
import { validateCreateClient } from '@/lib/validate'

export const OPTIONS = withCors()

// ---- GET: list clients ----
export const GET = withAuth([], async ({ payload, user }) => {
  const result = await payload.find({
    collection: 'clients',
    limit: 100,
    sort: '-createdAt',
    overrideAccess: false,
    user,
  })

  const showFullEin = isSuperAdminOrAdmin(user)
  const clients = sanitizeClients(result.docs, { showFullEin })

  return apiJson({
    ok: true,
    count: result.totalDocs,
    clients,
  })
})

// ---- POST: create a client ----
export const POST = withAuth(['super_admin', 'admin'], async ({ payload, user, request }) => {
  const body = await request.json()

  const validationError = validateCreateClient(body)
  if (validationError) {
    return apiError(validationError, 400)
  }

  const client = await payload.create({
    collection: 'clients',
    data: {
      externalId: body.externalId,
      name: body.name,
      signedAt: body.signedAt || '',
      category: body.category || '',
      status: body.status || 'Ready',
      pointOfContact: body.pointOfContact || '',
      email: body.email || '',
      phone: body.phone || '',
      ein: body.ein || '',
      address: body.address || '',
      totalAllocation: body.totalAllocation || 0,
      vendors: body.vendors || [],
      history: body.history || [],
    },
    overrideAccess: false,
    user,
  })

  return apiJson({ ok: true, message: 'Client created', client }, 201)
})
