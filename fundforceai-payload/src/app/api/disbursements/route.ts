/**
 * GET  /api/disbursements — list disbursements (admin+ only)
 * POST /api/disbursements — create a disbursement (admin+ only)
 *
 * Client-role users will eventually see their own disbursements
 * through a separate scoped endpoint or via the client portal.
 */

import { withAuth, withCors, apiJson, apiError } from '@/lib/apiHandler'
import { validateCreateDisbursement, normalizePurpose } from '@/lib/validate'

export const OPTIONS = withCors()

// ---- GET: list disbursements ----
export const GET = withAuth(['super_admin', 'admin'], async ({ payload, user }) => {
  const disbursements = await payload.find({
    collection: 'disbursements',
    limit: 100,
    sort: '-createdAt',
    overrideAccess: false,
    user,
  })

  const docs = disbursements.docs || []

  const totalCents = docs.reduce((sum: number, item: any) => sum + Number(item.amountCents || 0), 0)
  const pendingCents = docs
    .filter((item: any) => item.status === 'pending' || item.status === 'processing')
    .reduce((sum: number, item: any) => sum + Number(item.amountCents || 0), 0)
  const completedCents = docs
    .filter((item: any) => item.status === 'completed')
    .reduce((sum: number, item: any) => sum + Number(item.amountCents || 0), 0)

  return apiJson({
    ok: true,
    message: 'Disbursements loaded',
    count: disbursements.totalDocs,
    metrics: { totalCents, pendingCents, completedCents },
    disbursements: docs,
  })
})

// ---- POST: create a disbursement ----
export const POST = withAuth(['super_admin', 'admin'], async ({ payload, user, request }) => {
  const body = await request.json()

  const validationError = validateCreateDisbursement(body)
  if (validationError) {
    return apiError(validationError, 400)
  }

  const normalizedPurpose = normalizePurpose(body.purpose)
  const idempotencyKey = crypto.randomUUID()

  const disbursement = await payload.create({
    collection: 'disbursements',
    data: {
      clientId: body.clientId,
      clientName: body.clientName,
      vendorId: body.vendorId,
      vendorName: body.vendorName,
      amountCents: body.amountCents,
      purpose: normalizedPurpose,
      description: body.description || '',
      railType: 'ghost',
      status: 'pending',
      idempotencyKey,
      provider: 'manual',
      providerPaymentId: `ghost_${crypto.randomUUID()}`,
    },
    overrideAccess: false,
    user,
  })

  return apiJson({ ok: true, message: 'Ghost disbursement created', disbursement }, 201)
})
