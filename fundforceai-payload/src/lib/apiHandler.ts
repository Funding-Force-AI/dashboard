/**
 * Shared API handler utilities for all custom routes.
 *
 * - Authenticates the request via Payload auth (cookie-based JWT)
 * - Attaches CORS headers
 * - Enforces role-based access
 * - Provides consistent error responses
 *
 * Usage:
 *   import { withAuth, withCors, apiError } from '@/lib/apiHandler'
 *
 *   export const GET = withAuth(['super_admin', 'admin'], async ({ payload, user }) => {
 *     const data = await payload.find({ collection: 'clients', overrideAccess: false, user })
 *     return Response.json({ ok: true, data: data.docs })
 *   })
 *
 *   export const OPTIONS = withCors()
 */

import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'
import { headers as getHeaders } from 'next/headers'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Role = 'super_admin' | 'admin' | 'client'

type AuthenticatedUser = {
  id: string | number
  email: string
  role: Role
  relatedClient?: string | number | { id: string | number } | null
  [key: string]: unknown
}

type AuthContext = {
  payload: Payload
  user: AuthenticatedUser
  request: Request
}

type AuthHandler = (ctx: AuthContext) => Promise<Response>

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
}

/** Wrap a Response with CORS headers. */
export function withCorsHeaders(response: Response): Response {
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

/** Preflight OPTIONS handler. Use: `export const OPTIONS = withCors()` */
export function withCors() {
  return async () => new Response(null, { status: 204, headers: corsHeaders })
}

// ---------------------------------------------------------------------------
// JSON helpers
// ---------------------------------------------------------------------------

export function apiJson(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

export function apiError(message: string, status = 500): Response {
  return apiJson({ ok: false, error: message }, status)
}

// ---------------------------------------------------------------------------
// Role helpers
// ---------------------------------------------------------------------------

export function isSuperAdmin(user: { role?: string } | null | undefined): boolean {
  return user?.role === 'super_admin'
}

export function isAdmin(user: { role?: string } | null | undefined): boolean {
  return user?.role === 'admin'
}

export function isClient(user: { role?: string } | null | undefined): boolean {
  return user?.role === 'client'
}

export function isSuperAdminOrAdmin(user: { role?: string } | null | undefined): boolean {
  return isSuperAdmin(user) || isAdmin(user)
}

/** Extract the numeric/string client ID from a user's relatedClient field. */
export function getRelatedClientId(user: AuthenticatedUser): string | number | null {
  const rc = user?.relatedClient
  if (!rc) return null
  if (typeof rc === 'object' && rc !== null && 'id' in rc) return rc.id
  return rc as string | number
}

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------

/**
 * Wraps an API handler with authentication + role enforcement.
 *
 * @param allowedRoles - Roles permitted to call this endpoint.
 *   Pass an empty array `[]` to allow any authenticated user.
 * @param handler - The route logic, receives `{ payload, user, request }`.
 *
 * The Payload queries inside `handler` should use:
 *   `overrideAccess: false, user`
 * so that collection-level access control is respected.
 */
export function withAuth(allowedRoles: Role[], handler: AuthHandler) {
  return async (request: Request, routeCtx?: unknown) => {
    try {
      const payload = await getPayload({ config: configPromise })
      const headers = await getHeaders()
      const { user } = await payload.auth({ headers })

      if (!user) {
        return apiError('Not authenticated', 401)
      }

      const typedUser = user as unknown as AuthenticatedUser

      // Role gate
      if (allowedRoles.length > 0 && !allowedRoles.includes(typedUser.role)) {
        return apiError('Forbidden — insufficient role', 403)
      }

      // Pass route context through for dynamic params
      const response = await handler({ payload, user: typedUser, request })
      return response
    } catch (error: any) {
      console.error(`[API] ${request.method} ${request.url} error:`, error)
      return apiError(error?.message || 'Internal server error', 500)
    }
  }
}

/**
 * Public route wrapper — no auth required but still gets CORS + error handling.
 * Use sparingly (seed route in dev, health checks).
 */
export function withPublic(handler: (ctx: { payload: Payload; request: Request }) => Promise<Response>) {
  return async (request: Request) => {
    try {
      const payload = await getPayload({ config: configPromise })
      return await handler({ payload, request })
    } catch (error: any) {
      console.error(`[API] ${request.method} ${request.url} error:`, error)
      return apiError(error?.message || 'Internal server error', 500)
    }
  }
}
