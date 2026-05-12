import configPromise from '@payload-config'
import { getPayload } from 'payload'

type CreateDisbursementBody = {
  clientId?: string
  clientName?: string
  vendorId?: string
  vendorName?: string
  amountCents?: number
  purpose?: string
  description?: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const allowedPurposes = new Set([
  'marketing',
  'google_ads',
  'seo',
  'web_dev',
  'lead_gen',
  'consulting',
  'other',
])

function normalizePurpose(purpose?: string) {
  const map: Record<string, string> = {
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

    marketing: 'marketing',
    google_ads: 'google_ads',
    seo: 'seo',
    web_dev: 'web_dev',
    lead_gen: 'lead_gen',
    consulting: 'consulting',
    other: 'other',
  }

  return map[purpose || ''] || 'other'
}

export const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

  const disbursements = await payload.find({
    collection: 'disbursements',
    limit: 100,
    sort: '-createdAt',
  })

  const totalCents = disbursements.docs.reduce((sum: number, item: any) => {
    return sum + Number(item.amountCents || 0)
  }, 0)

  const pendingCents = disbursements.docs
    .filter((item: any) => item.status === 'pending' || item.status === 'processing')
    .reduce((sum: number, item: any) => sum + Number(item.amountCents || 0), 0)

  const completedCents = disbursements.docs
    .filter((item: any) => item.status === 'completed')
    .reduce((sum: number, item: any) => sum + Number(item.amountCents || 0), 0)

  return Response.json(
    {
      message: 'Disbursements loaded',
      count: disbursements.totalDocs,
      metrics: {
        totalCents,
        pendingCents,
        completedCents,
      },
      disbursements: disbursements.docs,
    },
    {
      headers: corsHeaders,
    },
  )
}

export const POST = async (request: Request) => {
  const payload = await getPayload({
    config: configPromise,
  })

  const body = (await request.json()) as CreateDisbursementBody

  const { clientId, clientName, vendorId, vendorName, amountCents, purpose, description } = body

  if (!clientId || !clientName || !vendorId || !vendorName || !amountCents || !purpose) {
    return Response.json(
      {
        error: 'clientId, clientName, vendorId, vendorName, amountCents, and purpose are required',
      },
      {
        status: 400,
        headers: corsHeaders,
      },
    )
  }

  if (amountCents <= 0) {
    return Response.json(
      {
        error: 'amountCents must be greater than 0',
      },
      {
        status: 400,
        headers: corsHeaders,
      },
    )
  }

  const normalizedPurpose = normalizePurpose(purpose)

  if (!allowedPurposes.has(normalizedPurpose)) {
    return Response.json(
      {
        error: 'Invalid purpose',
      },
      {
        status: 400,
        headers: corsHeaders,
      },
    )
  }

  const idempotencyKey = crypto.randomUUID()

  const disbursement = await payload.create({
    collection: 'disbursements',
    data: {
      clientId,
      clientName,
      vendorId,
      vendorName,
      amountCents,
      purpose: normalizedPurpose,
      description: description || '',
      railType: 'ghost',
      status: 'pending',
      idempotencyKey,
      provider: 'manual',
      providerPaymentId: `ghost_${crypto.randomUUID()}`,
    },
  })

  return Response.json(
    {
      message: 'Ghost disbursement created',
      disbursement,
    },
    {
      status: 201,
      headers: corsHeaders,
    },
  )
}
