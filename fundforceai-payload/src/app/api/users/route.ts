/**
 * GET  /api/users — list users (admin+ only, scoped by role)
 * POST /api/users — create a user (admin+ only)
 *
 * This replaces the frontend's direct call to Payload's native
 * /api/users endpoint, giving us control over auth checks,
 * role enforcement, and response shape.
 */

import {
  withAuth,
  withCors,
  apiJson,
  apiError,
  isSuperAdmin,
} from '@/lib/apiHandler'
import { validateCreateUser } from '@/lib/validate'

export const OPTIONS = withCors()

// ---- GET: list users ----
export const GET = withAuth(['super_admin', 'admin'], async ({ payload, user }) => {
  const result = await payload.find({
    collection: 'users',
    limit: 100,
    depth: 1, // populate relatedClient
    overrideAccess: false,
    user,
  })

  return apiJson({
    ok: true,
    count: result.totalDocs,
    users: result.docs,
  })
})

// ---- POST: create a user ----
export const POST = withAuth(['super_admin', 'admin'], async ({ payload, user, request }) => {
  const body = await request.json()

  const validationError = validateCreateUser(body)
  if (validationError) {
    return apiError(validationError, 400)
  }

  // Admin can only create client-role users
  // Super admin can create any role
  const requestedRole = body.role || 'client'
  if (!isSuperAdmin(user) && requestedRole !== 'client') {
    return apiError('Admin users can only create client-role accounts', 403)
  }

  const created = await payload.create({
    collection: 'users',
    data: {
      email: body.email,
      password: body.password,
      fullName: body.fullName || '',
      role: requestedRole,
      relatedClient: body.relatedClient || undefined,
    },
    overrideAccess: false,
    user,
  })

  // Don't return the password hash
  const { hash, salt, ...safeUser } = created as any

  return apiJson({ ok: true, message: 'User created', user: safeUser }, 201)
})
