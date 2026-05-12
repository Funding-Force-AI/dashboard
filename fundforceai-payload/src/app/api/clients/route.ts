import configPromise from '@payload-config'
import { getPayload } from 'payload'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export const OPTIONS = async () => {
  return new Response(null, { status: 204, headers: corsHeaders })
}

export const GET = async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'clients',
    limit: 100,
    sort: '-createdAt',
  })

  return Response.json(
    {
      ok: true,
      count: result.totalDocs,
      clients: result.docs,
    },
    { headers: corsHeaders },
  )
}

export const POST = async (request: Request) => {
  const payload = await getPayload({ config: configPromise })
  const body = await request.json()

  if (!body.externalId || !body.name) {
    return Response.json(
      { ok: false, error: 'externalId and name are required' },
      { status: 400, headers: corsHeaders },
    )
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
  })

  return Response.json(
    {
      ok: true,
      message: 'Client created',
      client,
    },
    { status: 201, headers: corsHeaders },
  )
}
