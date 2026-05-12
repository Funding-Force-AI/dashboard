import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { mockClients } from '@/lib/seed/mockClients'
import { toPayloadClient } from '@/lib/seed/transformClient'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export const GET = async () => {
  return Response.json(
    {
      ok: true,
      message: 'Seed route exists. Use POST to run the seed.',
      mockCount: mockClients.length,
    },
    {
      headers: corsHeaders,
    },
  )
}

export const POST = async () => {
  try {
    const payload = await getPayload({ config: configPromise })

    const savedClients = []

    for (const mockClient of mockClients) {
      const clientData = toPayloadClient(mockClient)

      const existing = await payload.find({
        collection: 'clients',
        where: {
          externalId: {
            equals: clientData.externalId,
          },
        },
        limit: 1,
      })

      if (existing.docs[0]) {
        const updated = await payload.update({
          collection: 'clients',
          id: existing.docs[0].id,
          data: clientData,
        })

        savedClients.push(updated)
      } else {
        const created = await payload.create({
          collection: 'clients',
          data: clientData,
        })

        savedClients.push(created)
      }
    }

    return Response.json(
      {
        ok: true,
        message: 'Mock clients seeded',
        count: savedClients.length,
        clientIds: savedClients.map((client: any) => client.externalId || client.id),
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error: any) {
    console.error('Seed clients error:', error)

    return Response.json(
      {
        ok: false,
        error: error?.message || 'Seed failed',
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}
