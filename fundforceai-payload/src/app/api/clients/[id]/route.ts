import configPromise from '@payload-config'
import { getPayload } from 'payload'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

type Params = {
  params: Promise<{
    id: string
  }>
}

async function findClientByExternalId(payload: any, externalId: string) {
  const result = await payload.find({
    collection: 'clients',
    where: {
      externalId: {
        equals: externalId,
      },
    },
    limit: 1,
  })

  return result.docs[0]
}

export const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export const GET = async (_request: Request, { params }: Params) => {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })

    const client = await findClientByExternalId(payload, id)

    if (!client) {
      return Response.json(
        {
          ok: false,
          error: 'Client not found',
        },
        {
          status: 404,
          headers: corsHeaders,
        },
      )
    }

    return Response.json(
      {
        ok: true,
        client,
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error: any) {
    return Response.json(
      {
        ok: false,
        error: error?.message || 'Failed to load client',
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}

export const PATCH = async (request: Request, { params }: Params) => {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })
    const body = await request.json()

    const client = await findClientByExternalId(payload, id)

    if (!client) {
      return Response.json(
        {
          ok: false,
          error: 'Client not found',
        },
        {
          status: 404,
          headers: corsHeaders,
        },
      )
    }

    const updated = await payload.update({
      collection: 'clients',
      id: client.id,
      data: body,
    })

    return Response.json(
      {
        ok: true,
        message: 'Client updated',
        client: updated,
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error: any) {
    return Response.json(
      {
        ok: false,
        error: error?.message || 'Failed to update client',
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}

export const DELETE = async (_request: Request, { params }: Params) => {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })

    const client = await findClientByExternalId(payload, id)

    if (!client) {
      return Response.json(
        {
          ok: false,
          error: 'Client not found',
        },
        {
          status: 404,
          headers: corsHeaders,
        },
      )
    }

    await payload.delete({
      collection: 'clients',
      id: client.id,
    })

    return Response.json(
      {
        ok: true,
        message: 'Client deleted',
        deletedExternalId: id,
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error: any) {
    return Response.json(
      {
        ok: false,
        error: error?.message || 'Failed to delete client',
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}
